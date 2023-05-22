const BigNumber = require('bignumber.js');
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
chai.use(require('chai-as-promised'));
const helper = require('./helper');

let qualification;

// sort addresses, use lowercase
const sortAddrs = (addrs) => {
    return addrs
        .map(a => a.toLowerCase())
        .sort()
        .map(a => ethers.utils.getAddress(a))
}

// use to determine min height of full tree that can contain all addrs
const getTreeHeight = (val) => {
    return Math.ceil(Math.log(val)/Math.log(2))
}

// build array, has to have size 2^n for some n in natural nums 
const buildAddrArr = async (nonZeroAddrs) => {
    let addrs = new Array(2 ** getTreeHeight(nonZeroAddrs.length))
    nonZeroAddrs = sortAddrs(nonZeroAddrs)

    for (let i = 0; i < addrs.length; i++) {
        addrs[i] =  i < nonZeroAddrs.length ? nonZeroAddrs[i] : ethers.constants.AddressZero
    }

    return addrs
}

// build tree
// tree format - 2d array, tree[0] is leaves, tree[tree.length - 1] is root level and tree[tree.length - 1][0] is root
// parent node in next level = idx in curr level // 2
const buildMerkleTree = async (addrs) => {
    let height = getTreeHeight(addrs.length)
    let tree = new Array(height + 1)
    // leaves are H(addr)
    tree[0] = addrs.map(addr => ethers.utils.keccak256(addr))

    for (let i = 1; i < tree.length; i++) {
        tree[i] = new Array(2 ** (height - i))

        for (let j = 0; j < tree[i].length; j++) {
            
            let leftChild = tree[i-1][2 * j]
            let rightChild = tree[i-1][2 * j + 1]

            tree[i][j] = ethers.utils.keccak256(
                leftChild < rightChild ? 
                    `0x${(leftChild).substring(2)}${(rightChild).substring(2)}` :
                    `0x${(rightChild).substring(2)}${(leftChild).substring(2)}`
            )
        }
    }

    return tree
}

// builds merkle path according to OZ merkleproof spec
// takes in tree with above format (2d tree, [0] is leaves level, [-1] is root level)
const getMerklePath = (tree, idx) => {
    let path = new Array(tree.length - 1)
    let currIdx = idx

    for (let i = 0; i < path.length ; i++) {
        path[i] = currIdx % 2 == 0 ? tree[i][currIdx + 1] : tree[i][currIdx - 1]
        currIdx = Math.floor(currIdx / 2)
    }

    return path
}

describe(`Test Merkle Operations`, async () => {
    before(async () => {
        let QualificationFactory = await ethers.getContractFactory("MerkleQualification")
        qualification = await QualificationFactory.deploy(ethers.constants.HashZero)
    })

    for (let numAddrs = 1; numAddrs < 50; numAddrs++) {
        it(`Test ${numAddrs}`, async () => {
            
            // create n random wallets
            let nonZeroAddrs = new Array(numAddrs).fill(undefined).map(
                (_, idx) => ethers.Wallet.createRandom().address
            )
            
            // fill tree up to 2^n for some n in natural nums, get the root
            let addrs = await buildAddrArr(nonZeroAddrs)

            let tree = await buildMerkleTree(addrs)
            console.log(`tree is:`)
            console.log(tree)

            // test all addr paths against verification
            await qualification.setMerkleRoot(tree[tree.length - 1][0])
            for (let i = 0; i < numAddrs; i++) {
                let ret = await qualification.logQualified(
                    addrs[i],
                    getMerklePath(tree, i)
                )
                assert.isTrue(ret.qualified)
            }
        })
    }
})
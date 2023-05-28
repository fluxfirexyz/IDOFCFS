import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { ethers, upgrades } from 'hardhat';;

export async function main(): Promise<void> {


  /**
   * 
   * FILL IN VARIABLES
   * 
   */
  const owner = "0xc38323f809654c0aB8aD6c27Bb7F0DCa77a39a57"
  const base_time = '0' // can leave as 0



  /**
   * Deploy merkle qualification contract
   */
  const MerkleQualification__Factory = await ethers.getContractFactory("MerkleQualificationFlat")
  const merkleQualification = await MerkleQualification__Factory.deploy()
  await merkleQualification.deployed()
  console.log(`merkle qualification deployed to ${merkleQualification.address}`)
  await merkleQualification.transferOwnership(owner)
  console.log("merkle qual ownership transferred")

  const HappyTokenPool__Factory = await ethers.getContractFactory("HappyTokenPoolFlat")
  const impl = await HappyTokenPool__Factory.deploy()
    await impl.deployed()
  console.log(`impl at ${impl.address}`)
  
  const Proxy__Factory = await ethers.getContractFactory("SolidityProxyFlat")
  const proxy = await Proxy__Factory.deploy()
  await proxy.deployed()
  console.log(`proxy at ${proxy.address}`)

  await proxy.setImplementation(impl.address)
  console.log(`proxy impl set to ${await proxy.implementation()} which should match impl addr at ${impl.address}`)

  const happyTokenPoolInstance = await HappyTokenPool__Factory.attach(proxy.address)
  await happyTokenPoolInstance.initialize(base_time)
  console.log(`initialized proxy with basetime ${base_time}`)  

};

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
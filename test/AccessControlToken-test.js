const {expect} = require("chai")
const { ethers } = require("hardhat")

describe("ACToken contract", function(){
    let totalSupply = '10000000000000000000000'
    let ACContract 
    let ACToken
    let admin, minter, foo, bar, zoo

    beforeEach(async function(){
        ACContract = await ethers.getContractFactory("AccessControlToken");
        [admin, minter, foo, bar, zoo] = await ethers.getSigners();

        ACToken = await ACContract.deploy(totalSupply)
    })

    describe("Deployment", function(){
        it("Should assign the total supply of token to the admin", async function(){
            const adminBalance = await ACToken.balanceOf(admin.address);
            console.log('adminBalance : ', adminBalance);
            expect(await ACToken.totalSupply()).to.equal(adminBalance);
        })
    })

    describe("Grants role to account", function(){
        it("Should add grant MINTER_ROLE to minter", async function(){
            const minterRole = ethers.utils.formatBytes32String("MINTER_ROLE")
            // await ACToken.grantRole('MINTER_ROLE', minter.address)
            const isMinterRole = await ACToken.hasRole(minterRole, minter.address)
            console.log('isMinterRole : ', isMinterRole)
        })
    })

})
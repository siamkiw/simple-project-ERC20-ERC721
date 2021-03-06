const {expect} = require("chai")
const { ethers } = require("hardhat")
require('chai').use(require('chai-as-promised')).should()

describe("ACToken contract", function(){
    let totalSupply = '10000000000000000000000'
    let ACContract 
    let ACToken
    let admin, minter, foo, bar, zoo, user

    const minterRole = ethers.utils.id("MINTER_ROLE")
    const fooRole = ethers.utils.id("FOO_ROLE")
    const barRole = ethers.utils.id("BAR_ROLE")
    const zooRole = ethers.utils.id("ZOO_ROLE")

    beforeEach(async function(){
        ACContract = await ethers.getContractFactory("AccessControlToken");
        [admin, minter, foo, bar, zoo, user] = await ethers.getSigners();

        ACToken = await ACContract.deploy(totalSupply)

        // add role to address
        await ACToken.grantRole(minterRole, minter.address)
        await ACToken.grantRole(fooRole, foo.address)
        await ACToken.grantRole(barRole, bar.address)
        await ACToken.grantRole(zooRole, zoo.address)

    })

    describe("Deployment", function(){
        it("Should assign the total supply of token to the admin", async function(){
            const adminBalance = await ACToken.balanceOf(admin.address);
            console.log('adminBalance : ', adminBalance);
            expect(await ACToken.totalSupply()).to.equal(adminBalance);
        })
    })

    describe("Grants role to account", function(){
        it("Should add role MINTER_ROLE to minter address", async function(){
            let isMinterRole = await ACToken.hasRole(minterRole, minter.address)
            expect(isMinterRole).to.equal(true)
        })

        it("Should add role FOO_ROLE to foo address", async function(){
            let isFooRole = await ACToken.hasRole(fooRole, foo.address)
            expect(isFooRole).to.equal(true)
        })

        it("Should add role BAR_ROLE to minter address", async function(){
            let isBarRole = await ACToken.hasRole(barRole, bar.address)
            expect(isBarRole).to.equal(true)
        })

        it("Should add role ZOO_ROLE to zoo address", async function(){
            let isZooRole = await ACToken.hasRole(zooRole, zoo.address)
            expect(isZooRole).to.equal(true)
        })

        it("User address should not has any role", async function(){
            let isMinterRole = await ACToken.hasRole(minterRole, user.address)
            expect(isMinterRole).to.equal(false)

            let isFooRole = await ACToken.hasRole(fooRole, user.address)
            expect(isFooRole).to.equal(false)

            let isBarRole = await ACToken.hasRole(barRole, user.address)
            expect(isBarRole).to.equal(false)

            let isZooRole = await ACToken.hasRole(zooRole, user.address)
            expect(isZooRole).to.equal(false)
        })
    })

    describe("Called contract function", function(){

        it("Minter address should invoke mint funtion", async function(){
            await ACToken.connect(minter).mint(minter.address, 100)
            const minterBalance = await ACToken.balanceOf(minter.address)
            expect(minterBalance).to.equal(100)
        })

        it("Should revert the transaction, called mint function by other role", async function(){
            await ACToken.connect(foo).mint(foo.address, 100).should.be.rejected
            await ACToken.connect(bar).mint(bar.address, 100).should.be.rejected
            await ACToken.connect(zoo).mint(zoo.address, 100).should.be.rejected
            await ACToken.connect(user).mint(user.address, 100).should.be.rejected
        })

        it("Foo address should invoke foo funtion", async function(){
            const res = await ACToken.connect(foo).foo()
            expect(res).to.equal("You are FOO_ROLE")
        })

        it("Should revert the transaction, called foo function by other role", async function(){
            await ACToken.connect(minter).foo().should.be.rejected
            await ACToken.connect(bar).foo().should.be.rejected
            await ACToken.connect(zoo).foo().should.be.rejected
            await ACToken.connect(user).foo().should.be.rejected
        })

        it("Bar address should invoke bar funtion", async function(){
            const res = await ACToken.connect(bar).bar()
            expect(res).to.equal("You are BAR_ROLE")
        })

        it("Should revert the transaction, called bar function by other role", async function(){
            await ACToken.connect(minter).bar().should.be.rejected
            await ACToken.connect(foo).bar().should.be.rejected
            await ACToken.connect(zoo).bar().should.be.rejected
            await ACToken.connect(user).bar().should.be.rejected
        })

        it("Zoo address should invoke zoo funtion", async function(){
            const res = await ACToken.connect(zoo).zoo()
            expect(res).to.equal("You are ZOO_ROLE")
        })

        it("Should revert the transaction, called zoo function by other role", async function(){
            await ACToken.connect(minter).zoo().should.be.rejected
            await ACToken.connect(foo).zoo().should.be.rejected
            await ACToken.connect(bar).zoo().should.be.rejected
            await ACToken.connect(user).zoo().should.be.rejected
        })

        it("Every role should invoke anyoneCanCall funtion", async function(){
            const expectAws = 'Anyone can call this function.'
            let res = await ACToken.anyoneCanCall()
            expect(res).to.equal(expectAws)

            res = await ACToken.connect(minter).anyoneCanCall()
            expect(res).to.equal(expectAws)

            res = await ACToken.connect(foo).anyoneCanCall()
            expect(res).to.equal(expectAws)

            res = await ACToken.connect(bar).anyoneCanCall()
            expect(res).to.equal(expectAws)

            res = await ACToken.connect(zoo).anyoneCanCall()
            expect(res).to.equal(expectAws)
        })
    })

    describe("Transaction", function(){
        it("Should transfer tokens between accounts", async function(){

            // Transfer 50 tokens from admin to user    
            await ACToken.transfer(user.address, 50);
            const userBalance = await ACToken.balanceOf(user.address);
            expect(userBalance).to.equal(50);

            // We use .connect(signer) to send a transaction from another account
            await ACToken.connect(user).transfer(foo.address, 50);
            const fooBalance = await ACToken.balanceOf(foo.address);
            expect(fooBalance).to.equal(50);
        })

        it("Should fail if sender doesn???t have enough tokens", async function(){
            const initialAdminBalance = await ACToken.balanceOf(admin.address);

            // Try to send 1 token from addr1 (0 tokens) to owner (1000000 tokens).
            // `require` will evaluate false and revert the transaction.
            await expect(
                ACToken.connect(user).transfer(admin.address, 1)
              ).to.be.revertedWith("ERC20: transfer amount exceeds balance")

            // Owner balance shouldn't have changed.
            expect(await ACToken.balanceOf(admin.address)).to.equal(
                initialAdminBalance
            )
        })
    })
})
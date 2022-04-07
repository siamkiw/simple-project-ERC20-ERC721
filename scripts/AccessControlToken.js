const her = require("hardhat")

async function main(){
    const ACToken = await her.ethers.getContractFactory("AccessControlToken")
    console.log("Deploy ACToken");
    const token = await ACToken.deploy('10000000000000000000000')

    await token.deployed()
    console.log("ACToken deployed to:", token.address)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(0)
    })
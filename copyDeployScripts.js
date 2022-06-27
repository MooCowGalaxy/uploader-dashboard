const fs = require("fs").promises
const fse = require('fs-extra')

async function main() {
    console.log(`Copying build scripts to \`../mooing/dist/dashboard\`...`)

    console.log(`- Removing previous scripts...`)
    await fs.rm('../mooing/dist/dashboard', {recursive: true, force: true})

    console.log(`- Creating new directory...`)
    await fs.mkdir('../mooing/dist/dashboard')

    console.log(`- Copying contents...`)
    await fse.copy('./build', '../mooing/dist/dashboard')

    console.log(`Done!`)
}

main().then(() => process.exit(0))

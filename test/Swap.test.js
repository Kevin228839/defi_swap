const AToken = artifacts.require("AToken");
const BToken = artifacts.require("Btoken");
const Swap = artifacts.require("Swap");

require('chai')
	.use(require('chai-as-promised'))
	.should()

function tokens(n) {
	return web3.utils.toWei(n, 'ether')
}

contract('Swap',([owner, investor]) => {
	let atoken, btoken, swap
	before(async() => {
		//load contract
		atoken = await AToken.new()
		btoken = await BToken.new()
		swap = await Swap.new(atoken.address, btoken.address)

		//send 1000 Atoken to investor
		await atoken.transfer(investor, tokens('1000'), { from:owner })

		//send 1000 Btoken to investor
		await btoken.transfer(investor, tokens('1000'), { from:owner })

	})

	describe("Token A deployment", async() => {
		it('has a name', async() => {
			const name = await atoken.name()
			assert.equal(name, "AAA Token")
		})
		it('investor has 1000 A token', async() => {
			const balance = await atoken.balanceOf(investor)
			assert.equal(balance,tokens('1000'))
		})
	})

	describe("Token B deployment", async() => {
		it('has a name', async() => {
			const name = await btoken.name()
			assert.equal(name, "BBB Token")
		})
		it('investor has 1000 B token', async() => {
			const balance = await btoken.balanceOf(investor)
			assert.equal(balance,tokens('1000'))
		})
	})

	describe("Swap deployment", async() => {
		it('has a name', async() => {
			const name = await swap.name()
			assert.equal(name, "Liquidity Pool")
		})
	})

	describe("Add liquidity", async() => {
		it('owner successfully added 0.5 million A token and 0.5 million B token', async() => {
			let result 
			
			//check swap's a token is equal to 0 before adding liquidity
			const balance = await atoken.balanceOf(swap.address)
			assert.equal(balance,tokens('0'))

			//add liquidity(0.5 million each)
			await atoken.approve(swap.address, tokens('500000'), { from: owner })
			await btoken.approve(swap.address, tokens('500000'), { from: owner })
			await swap.addLiquidity(tokens('500000'),tokens('500000'),{ from:owner })

			//check owner's token A amount is 499000
			result = await atoken.balanceOf(owner)
			assert.equal(result.toString(), tokens('499000'))

			//check owner's token B amount is 1499000
			result = await btoken.balanceOf(owner)
			assert.equal(result.toString(), tokens('1499000'))

			//check swap's token A amount is 500000
			result = await atoken.balanceOf(swap.address)
			assert.equal(result.toString(), tokens('500000'))

			//check swap's token B amount is 500000
			result = await btoken.balanceOf(swap.address)
			assert.equal(result.toString(), tokens('500000'))
		})
	})

	describe("Withdraw Liquidity", async() => {
		it('owner successfully withdrew 0.3 million A token and 0.3 million B token', async() => {
			let result

			//withdraw liquidity(0.3 million each)
			await swap.withdrawLiquidity(tokens('300000'), tokens('300000'), { from:owner })

			//check owner's token A amount is 799000
			result = await atoken.balanceOf(owner)
			assert.equal(result.toString(), tokens('799000'))

			//check owner's token B amount is 1799000
			result = await btoken.balanceOf(owner)
			assert.equal(result.toString(), tokens('1799000'))

			//check swap's token A amount is 200000
			result = await atoken.balanceOf(swap.address)
			assert.equal(result.toString(), tokens('200000'))

			//check swap's token B amount is 200000
			result = await btoken.balanceOf(swap.address)
			assert.equal(result.toString(), tokens('200000'))

		})
	})

	describe("Buy A token with B token", async() => {
		it("investor successfully buys 500 A token with 500 B token", async() => {
			let result

			//buy 500 A token with 500 B token
			await btoken.approve(swap.address, tokens('500'), { from: investor })
			await swap.buyAwithB(tokens('500'), {from:investor})

			//check investor's token A amount is 1500
			result = await atoken.balanceOf(investor)
			assert.equal(result.toString(), tokens('1500'))

			//check investor's token B amount is 500
			result = await btoken.balanceOf(investor)
			assert.equal(result.toString(), tokens('500'))

			//check swap's token A amount is 199500
			result = await atoken.balanceOf(swap.address)
			assert.equal(result.toString(), tokens('199500'))

			//check swap's token B amount is 200500
			result = await btoken.balanceOf(swap.address)
			assert.equal(result.toString(), tokens('200500'))

		})
	})

	describe("Buy B token with A token", async() => {
		it("investor succesfully buys 200 B token with 200 A token", async() => {
			let result

			//buy 200 B token with 200 A token
			await atoken.approve(swap.address, tokens('200'), { from: investor })
			await swap.buyBwithA(tokens('200'), {from:investor})

			//check investor's token A amount is 1300
			result = await atoken.balanceOf(investor)
			assert.equal(result.toString(), tokens('1300'))

			//check investor's token B amount is 700
			result = await btoken.balanceOf(investor)
			assert.equal(result.toString(), tokens('700'))

			//check swap's token A amount is 199700
			result = await atoken.balanceOf(swap.address)
			assert.equal(result.toString(), tokens('199700'))

			//check swap's token B amount is 200300
			result = await btoken.balanceOf(swap.address)
			assert.equal(result.toString(), tokens('200300'))
		})
	})








})
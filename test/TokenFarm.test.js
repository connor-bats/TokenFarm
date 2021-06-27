const { assert } = require('chai')

const DaiToken = artifacts.require('DaiToken')
const DappToken = artifacts.require('DappToken')
const TokenFarm = artifacts.require('TokenFarm')


require('chai')
    .use(require('chai-as-promised'))
    .should()


const tokens = (n) => {
    return web3.utils.toWei(n,'ether');
}

contract('TokenFarm', ([owner, investor]) => {
    let daiToken, dappToken, tokenFarm

    //Write Test inside here



    before(async() => {
        //Load contracts
        daiToken = await DaiToken.new()
        dappToken = await DappToken.new()
        tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address)
    
        // Transfer all Dapp Tokens to Farm(1 mil)
        await dappToken.transfer(tokenFarm.address,tokens('1000000'))

        //Send tokens to investor

        await daiToken.transfer(investor, tokens('100'), {from: owner})

    
    })

    describe('Mock Dai deployment', async() => {
        it('has a name', async() => {
            
            const name = await daiToken.name()
            assert.equal(name, 'Mock DAI Token')

        })
    })



    describe('Dapp Token deployment', async() => {
        it('has a name', async() => {
            
            const name = await dappToken.name()
            assert.equal(name, 'DApp Token')

        })
    })


    describe('Dapp Token deployment', async() => {
        it('has a name', async() => {
            
            const name = await tokenFarm.name()
            assert.equal(name, 'Dapp Token Farm')

        })


        it('contract has tokens', async() => {
            let balance = await dappToken.balanceOf(tokenFarm.address)
            assert.equal(balance.toString(), tokens('1000000'))
        })
    })




    describe('Farming Tokens', async () => {
        it('rewards investors for staking mDai tokens', async() => {
            let result
            //Check investor balance before staking
            result = await daiToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('100'), 'investor mock DAI correct balance before staking')
        
            // Check Mock DAI TOkens
            await daiToken.approve(tokenFarm.address, tokens('100'), {from:investor})
            await tokenFarm.stakeTokens(tokens('100'), {from:investor})
        
            //Check staking result

            result = await daiToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('0'), 'investor Mock Dai wallaet balance correct after staking')
        
            result = await tokenFarm.stakingBalance(investor)
            assert.equal(result.toString(), tokens('100'), 'investor staking balance correct after staking')

            result = await tokenFarm.isStaking(investor)
            assert.equal(result.toString(), 'true', 'investor Mock Dai wallaet balance correct after staking')

            //Issue Tokens
            await tokenFarm.issueTokens({from:owner})

            //Check balance after issuing

            result = await dappToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('100'), 'investor Dapp Token wallet balance corrrect after issuing Dapp Token')
        
            await tokenFarm.issueTokens({from:investor}).should.be.rejected;
            



            await tokenFarm.unstakeTokens({from:investor})
            result = await daiToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('100'), 'investor Mock DAI Wallet balance coorect after unstaking')


            result = await daiToken.balanceOf(tokenFarm.address)
            assert.equal(result.toString(), tokens('0'), 'Token Farm Mock DAI balance correct after staking')
            

            result = await tokenFarm.stakingBalance(investor)
            assert.equal(result.toString(), tokens('0'), 'investor staking balance correct after staking')

            result = await tokenFarm.isStaking(investor)
            assert.equal(result.toString(), 'false', 'investor staking status ccorect after staking')
            
        })
    })


    
})
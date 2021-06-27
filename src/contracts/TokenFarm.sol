pragma solidity  ^0.5.0;

import "./DappToken.sol";
import "./DaiToken.sol";

contract TokenFarm{
    // All code goes here

    string public name = "Dapp Token Farm";
    DappToken public dappToken;
    DaiToken public daiToken; 
    address public owner;

    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    address[] public stakers;
    mapping( address => bool) public isStaking;

    constructor(DappToken _dappToken, DaiToken _daiToken) public{
        dappToken = _dappToken;
        daiToken = _daiToken;
        owner = msg.sender;

    }


    //1. Stakes Tokens (Deposit)
    function stakeTokens(uint _amount) public{


        require(_amount > 0, "Amount cannot be 0");
        // Transfer Mock Dai Tokens to contract fro staking


        daiToken.transferFrom(msg.sender, address(this), _amount);

        // Update Staking Balance

        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        // Add users to stakers array *only* if they haven't staked already
        if(!hasStaked[msg.sender]){
            stakers.push(msg.sender);
        }

        // Update staking status
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;



    }



    // Unstaking tokens (Withdraw)

    function unstakeTokens() public {
        uint balance = stakingBalance[msg.sender];
        require(balance > 0, "Staking balance cannot be 0 for unstaking");

        daiToken.transfer(msg.sender, balance);

        stakingBalance[msg.sender] = 0;
        isStaking[msg.sender] = false; 


    }



    // Issuing Tokens (Interest)

    function issueTokens() public{
        require(msg.sender == owner, "caller must be the owner");
        for(uint i = 0; i<stakers.length; i++){
            
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient];

            if(balance > 0){
            dappToken.transfer(recipient, balance);
            }
        }
    }


    






}
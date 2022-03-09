pragma solidity ^0.5.0;

import "./AToken.sol";
import "./BToken.sol";

contract Swap {
	string public name = "Liquidity Pool";
	AToken public atoken;
	BToken public btoken;
	address public owner;
	//set transfer rate
	uint public rateA2B = 1;
	uint public rateB2A = 1;
	

	constructor(AToken _atoken, BToken _btoken) public {
		atoken = _atoken;
		btoken = _btoken;
		// set deployer as owner of the contract
		owner = msg.sender;
	}

	function addLiquidity(uint _addLiquidityAmountA, uint _addLiquidityAmountB) public {
		//only owner can add liquidity && adding amount should >= 0 && liquidity provider should have enough token 
		require(msg.sender == owner);
		require(_addLiquidityAmountA >= 0, "adding amount A should be greater than 0");
		require(_addLiquidityAmountB >= 0, "adding amount B should be greater than 0");
		require(atoken.balanceOf(msg.sender) >= _addLiquidityAmountA);
		require(btoken.balanceOf(msg.sender) >= _addLiquidityAmountB);

		// add liquidity 
		atoken.transferFrom(msg.sender, address(this), _addLiquidityAmountA);
		btoken.transferFrom(msg.sender, address(this), _addLiquidityAmountB);

	}

	function withdrawLiquidity(uint _withdrawLiquidityAmountA, uint _withdrawLiquidityAmountB) public {
		//only owner can withdraw liquidity && 
		require(msg.sender == owner);
		require(_withdrawLiquidityAmountA >= 0, "withdrawing amount A should be greater than 0");
		require(_withdrawLiquidityAmountB >= 0, "withdrawing amount B should be greater than 0");
		require(atoken.balanceOf(address(this)) >= _withdrawLiquidityAmountA);
		require(btoken.balanceOf(address(this)) >= _withdrawLiquidityAmountB);

		//withdraw liquidity
		atoken.transfer(msg.sender, _withdrawLiquidityAmountA);
		btoken.transfer(msg.sender, _withdrawLiquidityAmountB);
	}

	function buyAwithB(uint _amountB) public {

		//investors cannot sell more tokens B than they have
		require(btoken.balanceOf(msg.sender) >= _amountB);

		//calculate how much A token for redemption
		uint AtokenAmount = _amountB * rateB2A;

		//swap has enough token A 
		require(atoken.balanceOf(address(this)) >= AtokenAmount);

		//transfer B token from investor's wallet to swap
		btoken.transferFrom(msg.sender, address(this), _amountB);

		//transfer A token from swap to investor
		atoken.transfer(msg.sender, AtokenAmount);
	}

	function buyBwithA(uint _amountA) public {

		//investors cannot sell more tokens A than they have
		require(atoken.balanceOf(msg.sender) >= _amountA);

		//calculate how much B token for redemption
		uint BtokenAmount = _amountA * rateA2B;

		//swap has enough token B 
		require(btoken.balanceOf(address(this)) >= BtokenAmount);

		//transfer A token from investor's wallet to swap
		atoken.transferFrom(msg.sender, address(this), _amountA);

		//transfer B token from swap to investor
		btoken.transfer(msg.sender, BtokenAmount);
	}









}
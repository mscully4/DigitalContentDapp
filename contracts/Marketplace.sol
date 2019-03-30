pragma solidity ^0.5.0;

contract Marketplace {
    //seller
    struct item {
        uint id;
        address uploader;
        string name;

    }

    struct seller {
        bool init;
        address addr;
        uint[] items;
    }

    /*struct buyer {
        bool init;
        address addr;
        string[] hashes;
    }*/

    uint public counter = 0;
    mapping(uint => item) public items;
    mapping(address => seller) public sellers;

    function add(string memory _name) public {
        counter++;
        items[counter] = item(counter, msg.sender, _name);
        if (sellers[msg.sender].init) {
        
        } else {
            uint[] memory transactions;
            sellers[msg.sender] = seller(true, msg.sender, transactions); 
        }
        sellers[msg.sender].items.push(counter);
    }

    function countUploads(address _addr) public view returns(uint) {
        uint count = 0;
        for (uint i=0; i<sellers[_addr].items.length; ++i) {
            ++count;
        }
        return count;
    }

    function searchBySeller(address _addr) public view returns(uint[] memory) {
        return sellers[_addr].items;
    } 

    //buyer
    function buy(address payable _to, uint _price) public payable returns(uint) {
        
        require(msg.value >= (_price*10**18));
        _to.transfer(msg.value);
        return msg.value;
    }

    function getBalance(address _addr) public view returns(uint) {
        return address(_addr).balance / (10**18);
    }
}

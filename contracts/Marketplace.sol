pragma solidity ^0.5.0;

contract Marketplace {
    //seller
    struct item {
        uint id;
        address uploader;
        string name;
        string price;
        string hash;
    }

    struct seller {
        bool init;
        address addr;
        uint[] items;
    }

    struct buyer {
        bool init;
        address addr;
        uint[] items;
    }

    uint public counter = 0;
    mapping(uint => item) public items;
    mapping(address => seller) public sellers;
    mapping(address => buyer) public buyers;

    event Upload(uint counter);

    function add(string memory _name, string memory _price, string memory _hash) public {
        counter++;
        items[counter] = item(counter, msg.sender, _name, _price, _hash);
        if (!sellers[msg.sender].init) {
            uint[] memory transactions;
            sellers[msg.sender] = seller(true, msg.sender, transactions); 
        }
        sellers[msg.sender].items.push(counter);
        emit Upload(counter);
    }

    function countUploads(address _addr) public view returns(uint) {
        uint count = 0;
        for (uint i=0; i<sellers[_addr].items.length; ++i) {
            ++count;
        }
        return count;
    }

    function loadFeed(uint _numberOfItems) public view returns(uint[] memory) {
        uint[] memory feed;
        if (_numberOfItems > counter) {
            for (uint i=0; i<counter; ++i) {
                feed[i] = i;
            } 
        } 
    }

    function searchBySeller(address _addr) public view returns(uint[] memory) {
        return sellers[_addr].items;
    } 

    //buyer
    function buy(address payable _to, uint _id, uint _price) public payable returns(uint) {
       require(msg.value >= _price); 
        _to.transfer(msg.value);
        if (!buyers[msg.sender].init) {
            uint[] memory transactions;
            buyers[msg.sender] = buyer(true, msg.sender, transactions);
        }
        buyers[msg.sender].items.push(_id);
        return msg.value;
    }

    function searchByBuyer(address _addr) public view returns(uint[] memory) {
        return buyers[_addr].items;
    }


    function getBalance(address _addr) public view returns(uint) {
        return address(_addr).balance / (10**18);
    }
}

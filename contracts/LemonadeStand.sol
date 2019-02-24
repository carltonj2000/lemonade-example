pragma solidity ^0.4.25;

contract LemonadeStand {
    address public owner;
    uint skuCount;
    enum State { ForSale, Sold, Shipped }
    struct Item {
        string name;
        uint sku;
        uint price;
        State state;
        address seller;
        address buyer;
    }

    mapping (uint => Item) items;

    event ForSale(uint skuCount);
    event Sold(uint sku, uint change);
    event Shipped(uint sku);

    modifier onlyOwner() {
        require(msg.sender == owner, "must be owner");
        _;
    }

    modifier verifyCaller(address _address) {
        require(msg.sender == _address, "incorrect caller");
        _;
    }

    modifier paidEnough(uint _price) {
        require(msg.value >= _price, "insufficent funds");
        _;
    }

    modifier forSale(uint _sku) {
        require(items[_sku].state == State.ForSale, "is not for sale");
        _;
    }
    modifier sold(uint _sku) {
        require(items[_sku].state == State.Sold, "is not sold");
        _;
    }

    constructor () public {
        owner = msg.sender;
        skuCount = 0;
    }

    function addItem(string _name, uint _price) public onlyOwner {
        skuCount = skuCount + 1;
        emit ForSale(skuCount);
        items[skuCount] = Item({
            name: _name,
            sku: skuCount,
            price: _price,
            state: State.ForSale,
            seller: msg.sender,
            buyer: 0
        });
    }

    function buyItem(uint sku) 
        public payable forSale(sku) paidEnough(items[sku].price) {
        address buyer = msg.sender;
        uint price = items[sku].price;
        items[sku].buyer = buyer;
        items[sku].state = State.Sold;
        uint change = msg.value - price;
        items[sku].seller.transfer(price);
        items[sku].buyer.transfer(change);
        emit Sold(sku, change);
    }


    function shipItem(uint sku) 
        public sold(sku) verifyCaller(items[sku].seller) {
        items[sku].state = State.Shipped;
        emit Shipped(sku);
    }
    
    function fetchItem(uint _sku) public view returns (string name, uint sku, 
        uint price, string stateIs, address seller, address buyer) {
        name = items[_sku].name;
        sku = items[_sku].sku;
        price = items[_sku].price;
        seller = items[_sku].seller;
        buyer = items[_sku].buyer;
        uint state;
        state = uint(items[_sku].state);
        if (state == 0) {stateIs = "For Sale";}
        if (state == 1) {stateIs = "Sold";}
    }
}

App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    return await App.initWeb3();
  },

    initWeb3: async function() {
        if (typeof web3 !== 'undefined') {
            // If a web3 instance is already provided by Meta Mask.
            App.web3Provider = web3.currentProvider;
            web3 = new Web3(web3.currentProvider);
        } else {
            // Specify default instance if no web3 instance provided
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
            web3 = new Web3(App.web3Provider);
        }
        return App.initContract();
    },

    initContract: function() {
        $.getJSON("Marketplace.json", function(marketplace) {
            // Instantiate a new truffle contract from the artifact
            App.contracts.Marketplace = TruffleContract(marketplace);
            // Connect provider to interact with contract
            App.contracts.Marketplace.setProvider(App.web3Provider);

            //App.listenForEvents();

            return App.render();
        });
    // return App.bindEvents();
    },

    render: function() {
        // Load account data
        web3.eth.getCoinbase(function(err, account) {
            if (err === null) {
                App.account = account;
                //console.log(account);
            }
        });

        App.contracts.Marketplace.deployed().then(function(instance) {
            marketplaceInstance = instance;
            // Load feed
            marketplaceInstance.counter().then(function(feedSize) {
                const node = new window.Ipfs();
                var feedRow = $('#feedRow');
                if (feedSize < 12) {
                    for (i=0; i<feedSize; ++i) {
                        marketplaceInstance.items(i+1).then(function(item) {
                            var itemTemplate = $('#itemTemplate');
                            itemTemplate.find('img').attr('id', "image" + item[0]);
                            itemTemplate.find('.panel-title').text(item[2]);
                            itemTemplate.find('.item-artist').text(item[1]);
                            itemTemplate.find('.item-price').text(item[3]);
                            itemTemplate.find('.item-hash').text(item[4]);
                            itemTemplate.find('.btn-adopt').attr('data-id', item[0]);
                            feedRow.append(itemTemplate.html());
                            App.downloadImage(item[4], item[0]);
                        })
                    }
                }
            })
            $(document).on('click', '.btn-adopt', App.handlePurchase);
            //$(document).on('click', '#submit-item', App.uploadImage);
        })
    },

    handlePurchase: function() {
        event.preventDefault();
        var itemId = parseInt($(event.target).data('id'));
        marketplaceInstance.items(itemId).then(function(item) {
            marketplaceInstance.buy(item[1], itemId, item[3], {value:item[3]} );
        })
    },

    downloadImage: function(hash, id) {
        var image = document.querySelector("#image" + id);
        const node = new window.Ipfs();
        node.on('ready', function() {
            node.cat(hash, function(err, file) {
                if (err) {
                    throw err
                } else {
                    image.src = file.toString('utf8');
                }
            })
        })
    },

    uploadImage: function () {
        event.preventDefault();
        var name = document.querySelector("input[name$='name']").value;
        var price = document.querySelector("input[name$='price']").value;
        var file = document.querySelector('input[type=file]').files[0]; //sames as here
        var preview = document.querySelector('#upload-preview');
        var reader = new FileReader();
        var path;
        reader.addEventListener("load", function () {
            const node = new window.Ipfs();
            node.on('ready', () => {
                var content = node.types.Buffer.from(reader.result);
                node.add(content, function(err, hash) {
                    if (err) {
                        throw err
                    } else {
                        path = hash[0].path;
                        marketplaceInstance.add(name, (price*10**18).toString(), path);
                    }
                });
            });
        }, false);
        if (file) {
            reader.readAsDataURL(file); //reads the data as a URL
        }
    },

    previewImage: function() {
        var file = document.querySelector('input[type=file]').files[0]; //sames as here
        var preview = document.querySelector('#upload-preview');
        var reader = new FileReader();
        reader.addEventListener("load", function () {
            preview.src = reader.result;
        });
        if (file) {
            reader.readAsDataURL(file);
        }
        return reader;
    }

    /*bindEvents: function() {
        $(document).on('click', '.btn-adopt', App.handleAdopt);
    },*/

/*  markAdopted: function(adopters, account) {
  },*/

  /*handleAdopt: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));
  }*/

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});

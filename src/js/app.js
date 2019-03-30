App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load pets.
    /*$.getJSON('../pets.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });*/

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
                console.log(account);
            }
        });

        App.contracts.Marketplace.deployed().then(function(instance) {
            marketplaceInstance = instance;
            // Load feed
            marketplaceInstance.counter().then(function(feedSize) {
                //const IPFS = require('base');
                //const node = new IPFS();
                var feedRow = $('#feedRow');
                if (feedSize < 12) {
                    for (i=0; i<feedSize; ++i) {
                        marketplaceInstance.items(i+1).then(function(item) {
                            var itemTemplate = $('#itemTemplate');
                            itemTemplate.find('.panel-title').text(item[2]);
                            itemTemplate.find('.item-artist').text(item[1]);
                            //petTemplate.find('.pet-breed').text(data[i].price);
                            itemTemplate.find('.btn-adopt').attr('data-id', item.id);

                            feedRow.append(itemTemplate.html());
                        })
                    }
                }
            })
      /*var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });*/

            console.log(marketplaceInstance);
        })
    },

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

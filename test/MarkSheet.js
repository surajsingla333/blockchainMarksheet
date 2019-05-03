var MarkSheet = artifacts.require("./MarkSheet.sol");

contract("Marksheet", function(accounts) {

    it("initializes with dean", function(){
        return MarkSheet.deployed().then(function(instance) {
            return instance.dean();
        }).then(function(ad) {
            assert.equal(ad, 0xaBEEee6BD0C9C9801935395F00eC6f8c24B973b1);
        });
    });

    it("checks the teacher address", function(){
        return MarkSheet.deployed().then(function(instance) {
            return instance.checkTeacher("0x2E23fcf48E3f8Fcf3aBD03654E4dB657F00D5285");
        }).then(function(_ad){
            // assert.equal(_ad, 0x2E23fcf48E3f8Fcf3aBD03654E4dB657F00D5285);
            assert.equal(_ad, 1);
        })
    })
})
App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  
  init: function() {
    return App.initWeb3();
  },

  
  // init: async function() {
  //   // Load pets.
  //   $.getJSON('../pets.json', function(data) {
  //     var petsRow = $('#petsRow');
  //     var petTemplate = $('#petTemplate');

  //     for (i = 0; i < data.length; i ++) {
  //       petTemplate.find('.panel-title').text(data[i].name);
  //       petTemplate.find('img').attr('src', data[i].picture);
  //       petTemplate.find('.pet-breed').text(data[i].breed);
  //       petTemplate.find('.pet-age').text(data[i].age);
  //       petTemplate.find('.pet-location').text(data[i].location);
  //       petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

  //       petsRow.append(petTemplate.html());
  //     }
  //   });

  //   return await App.initWeb3();
  // },

  initWeb3: async function() {
    if(typeof web3 !== 'undefined') {
      App.web3Provider = window.ethereum;
      // 'web3.currentProvider;
      web3 = new Web3 (window.ethereum);
      // (web3.currentProvider);
      console.log("\nIn IF\n", web3);
    } else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(web3.web3Provider);
      console.log("\nIn ELSE\n", web3);
    }
    return App.initContract();
  },

  initContract: function() {
    ethereum.enable();
    $.getJSON("MarkSheet.json", function(marksheet) {
      // Instantiate new truffle contract from the artifact
      App.contracts.MarkSheet = TruffleContract(marksheet);
      // Conect provider to interact with contract
      App.contracts.MarkSheet.setProvider(App.web3Provider);
      
      App.listenForEvents();

      return App.render();
    });
    // return App.bindEvents();
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.MarkSheet.deployed().then(function(instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // // https://github.com/MetaMask/metamask-extension/issues/2393
      // instance.votedEvent({}, {
      //   fromBlock: 0,
      //   toBlock: 'latest'
      console.log("IN EVENT LISTENER", instance);
      // }).watch(function(error, event) {
        // console.log("event triggered", event)
        // Reload when a new vote is recorded
        App.render();
      // });
    });
  },

  // bindEvents: function() {
  //   $(document).on('click', '.btn-adopt', App.handleAdopt);
  // },

  render: function(){
    var markSheetInstance;
    var loader = $("#loader");
    var content = $("#content");
    var dean = $("#dean_data");
    var teacher = $("#teacher_data");
    var student = $("#student_data");
    var alert = $("#noAddress")

    loader.show();
    content.hide();
    alert.hide();
    dean.hide();
    teacher.hide();
    student.hide();

    // load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        console.log("Account is\n", account);
        $("#accountAddress").html("Your Account: " + account);
      }
    });

    // Load contract data
    App.contracts.MarkSheet.deployed().then(function(instance){
      console.log("\nin deployed\n")
      markSheetInstance = instance;
      console.log("\nmarksheet\n",markSheetInstance)
      return markSheetInstance.dean();
    }).then(function(_dean){
      markSheetInstance.subDetails(27001).then(function(ins){
        console.log(ins);
      });
      $("#deanAd").html("Dean is: "+ _dean);
      console.log("dean", _dean);
      if(App.account == _dean){
        loader.hide();
        content.show();
        dean.show();
      }
      return markSheetInstance.checkTeacher(App.account);
    }).then(function(_teach){
      if(_teach[2]==true){
        loader.hide();
        content.show();
        teacher.show();
      }
      return markSheetInstance.checkStudent(App.account);
    }).then(function(_student){
      if(_student[5]==true){
        loader.hide();
        content.show();
        student.show();
      }
      else{
        loader.hide();
        content.show();
        alert.show();
      }
    }).catch(function(err){
      console.log("\nerr\n",err);
    });
    $("#noAddress").html("Not a registered Account");
  },
  //     else{
  //       markSheetInstance.checkTeacher(App.account).then(function(inst){
  //         console.log("teacher", inst);
  //         if(inst[2]==true){
  //           loader.hide();
  //           content.show();
  //           dean.hide();
  //           teacher.show();
  //           student.hide();
  //           return;
  //         }
  //         else {
  //           markSheetInstance.checkStudent(App.account).then(function(sInst){
  //             console.log("student", sInst);
  //             if(sInst[5]==true){
  //               loader.hide();
  //               content.show();
  //               dean.hide();
  //               teacher.hide();
  //               student.show();
  //               return;
  //             }
  //             else{
  //               $("#noAddress").html("<h1>You are not authorized</h1>");
  //               loader.hide();
  //               content.show();
  //               dean.hide();
  //               teacher.hide();
  //               student.hide();
  //               return;
  //             }
  //           })
  //         }
  //       })
  //     }
  //   }).catch(function(error){
  //     console.warn(error);
  //   });

  // },


  sendalert:function(){
    console.log("IN 1");
    var my = "apple";
    this.alertFunc("from sendAlert to alertfunc" + my);
    console.log("IN 2");
  },

  alertFunc:function(txt){
    alert(txt);
    console.log(txt);
  },

  // student function
  checkMarks:function(){
    var studentAddress = $("#getAddressMarks").val();
    console.log(studentAddress);
    App.contracts.MarkSheet.deployed().then(function(instance) {
      return instance.showMarks(studentAddress, {from: App.account });
    }).then(function(result){
      console.log(result);
      $("#studMark").html("this"+result);
      console.log("this")
      $("#content").hide();
      $("#student_data").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.log(err);
    });
    console.log("adding subject");
    // alert("subject added");
  },

  //teacher function
  submitMarks:function(){
    var studentAddress = $("#submitMarks_address").val();
    var subjectID =$("#submitMarks_ID").val();
    var mark=$("#submitMarks_marks").val();
    console.log(studentAddress);
    console.log(subjectID);
    console.log(mark);
    App.contracts.MarkSheet.deployed().then(function(instance){
      return instance.marks(studentAddress, subjectID, mark, {from: App.account});
    }).then(function(result){
      console.log(result);
      $("#loader").show();
      $("#content").hide();
      $("#dean_data").hide();
      $("#teacher_data").hide();
      $("#student_data").hide();
    }).catch(function(err) {
      console.log(err);
    });
    console.log("adding subject");
    alert("subject added");
  },

  //dean functions
  addSubject:function(){
    var subjectName = $("#subjectAddName").val();
    var subjectID = $("#subjectAddID").val();
    var subjectCode = $("#subjectAddCode").val();
    console.log(subjectName);
    console.log(subjectID);
    console.log(subjectCode);
    App.contracts.MarkSheet.deployed().then(function(instance){
      return instance.addSubDetails(subjectID,subjectName, subjectCode, {from: App.account});
    }).then(function(result){
      console.log(result);
      $("#loader").show();
      $("#content").hide();
      $("#dean_data").hide();
      $("#teacher_data").hide();
      $("#student_data").hide();
    }).catch(function(err) {
      console.log(err);
    });
    console.log("adding subject");
    alert("subject added");
  },

  addBranch:function(){
    var branchName = $("#branchAdd_name").val();
    console.log(branchName);
    App.contracts.MarkSheet.deployed().then(function(instance){
      return instance.addBranch(branchName, {from: App.account});
    }).then(function(result){
      console.log(result);
      $("#loader").show();
      $("#content").hide();
      $("#dean_data").hide();
      $("#teacher_data").hide();
      $("#student_data").hide();
    }).catch(function(err) {
      console.log(err);
    });
    console.log("adding subject");
    alert("subject added");
  },

  addSubInBranch:function(){
    var branchName = $("#subInBranch_name").val();
    var subid = $("#subInBranch_subID").val();
    var sem = $("#subInBranch_sem").val();
    console.log(branchName);
    console.log(subid);
    console.log(sem);
    App.contracts.MarkSheet.deployed().then(function(instance){
      return instance.addSubInBranch(branchName, subid, sem,{from: App.account});
    }).then(function(result){
      console.log(result);
      $("#loader").show();
      $("#content").hide();
      $("#dean_data").hide();
      $("#teacher_data").hide();
      $("#student_data").hide();
    }).catch(function(err) {
      console.log(err);
    });
    console.log("adding subject");
    alert("subject added");
  },

  addTeach:function(){
    var teacherAdd = $("#teacherAdd_add").val();
    var teacherName = $("#teacherAdd_name").val();
    var teacherBranch = $("#teacherAdd_branch").val();
    var teacherSub = $("#teacherAdd_subID").val();
    console.log(teacherAdd);
    console.log(teacherName);
    console.log(teacherBranch);
    console.log(teacherSub);
    App.contracts.MarkSheet.deployed().then(function(instance){
      return instance.addTeacher(teacherAdd, teacherName, teacherBranch, teacherSub, {from: App.account});
    }).then(function(result){
      console.log(result);
      $("#loader").show();
      $("#content").hide();
      $("#dean_data").hide();
      $("#teacher_data").hide();
      $("#student_data").hide();
    }).catch(function(err) {
      console.log(err);
    });
    console.log("adding subject");
    alert("subject added");
  },

  studentAdd:function(){
    var studentAdd = $("#addStudent_add").val();
    var studentName = $("#addStudent_name").val();
    var studentBranch = $("#addStudent_branch").val();
    var studentBatch = $("#addStudent_batch").val();
    var studentClass = $("#addStudent_class").val()
    console.log(studentAdd);
    console.log(studentName);
    console.log(studentBranch);
    console.log(studentBatch);
    console.log(studentClass);
    App.contracts.MarkSheet.deployed().then(function(instance){
      return instance.addStudent(studentAdd, studentName, studentBranch, studentBatch, studentClass, {from: App.account});
    }).then(function(result){
      console.log(result);
      $("#loader").show();
      $("#content").hide();
      $("#dean_data").hide();
      $("#teacher_data").hide();
      $("#student_data").hide();
    }).catch(function(err) {
      console.log(err);
    });
    console.log("adding subject");
    alert("subject added");
  },

  markAdopted: function(adopters, account) {
    /*
     * Replace me...
     */
  },

  handleAdopt: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    /*
     * Replace me...
     */
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});

pragma solidity ^0.5.8;
// pragma experimental ABIEncoderV2;

contract MarkSheet {
    
    address public dean;
    address[] public teachers;
    address[] public students;
    // address[] public alumini;
    uint128[] allSubjects;
    string[] allBranches;
    // uint8[] public allSem;
    
    constructor() public {
        dean = msg.sender;
        teachers.push(0x29f6d395EF6c3f825734de2ac89535B94F7521Ce);
        checkTeacher[0x29f6d395EF6c3f825734de2ac89535B94F7521Ce].isTeacher = true;
        students.push(0x078928D9DEA17d88745d502e5C818B99FA8FD3fb);
        checkStudent[0x078928D9DEA17d88745d502e5C818B99FA8FD3fb].isStudent = true;
    }
    
    modifier _isDean {
        require(msg.sender == dean, "Not a dean");
        _;
    }
    /*Write all test getters here*/
    
    // function getAllBranches() public view returns(string[] memory){
    //     return allBranches;
    // }
    // function getAllSubjects() public view returns(uint128[] memory){
    //     return allSubjects;
    // }
    
    /* End test getters*/
    
    /* Subject subDetails */
    
    struct subjectDetails{
        string subjectName;
        string subjectCode;
        bool isSubject;
    }
    
    // mapping subject ID with struct
    mapping(uint128 => subjectDetails) public subDetails;
    
    // adding subject details using above mapping
    function addSubDetails(uint128 _subID, string memory _subName, string memory _subCode) public _isDean returns(bool) {
        require(subDetails[_subID].isSubject != true, "Subject already present");
        subDetails[_subID].subjectName = _subName;
        subDetails[_subID].subjectCode = _subCode;
        allSubjects.push(_subID);
        subDetails[_subID].isSubject = true;
        return true;
    }
    
    /*End of subject details*/
    
    /* branch+sem details*/
    
    // struct containing subjects in each branch 
    struct branch{
        uint128[] branchSubjects;
        uint8[] subjectSem;
        bool isBranch;
    }
    
    // add new branch (by admin/dean)
    function addBranch(string memory _branch) public _isDean returns(bool){
        require(subInBranch[_branch].isBranch != true, "Branch already present");
        allBranches.push(_branch);
        subInBranch[_branch].isBranch = true;
        return true;
    }
    
    // maps branch name with struct 
    mapping(string => branch) subInBranch;
    // maps branch with id to check for duplicacy
    mapping(string => mapping(uint128 => bool)) checkSubInBranch;
    // maps Semester(1-8) with struct to store subjects
    mapping(uint8 => uint128[]) subInSem;
    // maps for duplicacy check
    mapping(string => mapping(uint8 => mapping(uint128 => bool))) checkSubInSemBranch;

    // adding subject in each branch
    function addSubInBranch(string memory _branch, uint128 _subID, uint8 _sem) public _isDean returns(bool){
        require(subInBranch[_branch].isBranch == true, "Invalid branch");
        require(subDetails[_subID].isSubject == true, "Invalid subject");
        require(_sem>0&&_sem<=8, "Invalid semester");
        require(checkSubInBranch[_branch][_subID] != true, "Subject already added in branch");
        require(checkSubInSemBranch[_branch][_sem][_subID] != true, "Subject already added");
        subInSem[_sem].push(_subID);
        checkSubInSemBranch[_branch][_sem][_subID] = true;
        subInBranch[_branch].branchSubjects.push(_subID);
        subInBranch[_branch].subjectSem.push(_sem);
        checkSubInBranch[_branch][_subID] = true;
        return true;
    }
    
    // getting subject of each branch
    function getSubFromBranch(string memory _branch) public view returns(uint128[] memory){
        return subInBranch[_branch].branchSubjects;
    }
    
    //get subjects of each semester
    function getSubFromSem(uint8 _sem) public view returns(uint128[] memory){
        return subInSem[_sem];
    }
    
    /*end of branch/sem details*/
    
    
    /* Working to get subjects if branch and semester are known*/
    
    // mapping to store subjects with branch and semester
    // mapping(string => mapping(uint8 => uint128[])) getID;
    uint128[] public getID;
    
    // get subjects with known branch and semester
    function getSub(string memory _branch, uint8 _sem) public returns(uint128[] memory){
        require(subInBranch[_branch].isBranch == true, "Invalid branch");
        require(_sem>0&&_sem<=8, "Invalid sem");
        uint128[] memory bSub = subInBranch[_branch].branchSubjects;
        // uint128[] memory semSub = subInSem[_sem];
        uint8[] memory branchSemSub = subInBranch[_branch].subjectSem;
        delete getID;
        for(uint8 i = 0; i<bSub.length; i++){
            // for(uint8 j=0; j<branchSemSub.length; j++){
            if(branchSemSub[i] == _sem){
                getID.push(bSub[i]);
            }
            else {
                continue;
            }
            // }
        }
        return getID;
    }
    
    /* end of working to get subjects with known branch and semester*/
    
    /*Teachers details*/
    
    //teacher struct
    struct teach{
        string name;
        string branchIn;
        uint128[] subjects;
        bool isTeacher;
    }
    
    //checks teachers' address
    mapping(address => teach) public checkTeacher;
    // check duplicacy of subjects in each teacher's address
    mapping(address => mapping(uint128 => bool)) checkTeachSub; 
    
    
    // add teacher
    function addTeacher(address _ad, string memory _name, string memory _branchIn, uint128 _subjects) public _isDean returns (bool){
        require(checkTeacher[_ad].isTeacher != true, "Teacher already present");
        require(subInBranch[_branchIn].isBranch == true, "Invalid branch");
        require(subDetails[_subjects].isSubject == true, "Invalid subject");
        require(checkSubInBranch[_branchIn][_subjects] == true, "Subject not in branch");
        require(checkTeachSub[_ad][_subjects] != true, "Subject already alotted");
        checkTeacher[_ad].name = _name;
        checkTeacher[_ad].branchIn = _branchIn;
        checkTeacher[_ad].subjects.push(_subjects);
        checkTeacher[_ad].isTeacher = true;
        checkTeachSub[_ad][_subjects] = true;
        teachers.push(_ad);
        return true;
    }
    
    // get all teachers' addresses
    function getTeachers() public view returns(address[] memory){
        return teachers;
    }
    
    /*end of teachers details*/
    
    
    /*Students details*/
    
    //student struct
    struct student{
        string name;
        string branchIn;
        string batch;
        uint8 sem;
        string class;
        bool isStudent;
    }
    
    //checks students' address
    mapping(address => student) public checkStudent;
    
    // student list according to branch
    mapping(string => address[]) branchStudent;
    
    // student list according to class
    mapping(string => address[]) classStudent;
    
    // student list according to sem
    mapping(uint8 => address[]) semStudent;
    
    // add student
    function addStudent(address _ad, string memory _name, string memory _branchIn, string memory _batch, string memory _class) public _isDean returns (bool){
        require(checkStudent[_ad].isStudent != true, "Student already present");
        require(subInBranch[_branchIn].isBranch == true, "Invalid branch");
        // require(subDetails[_subjects].isSubject == true);
        checkStudent[_ad].name = _name;
        checkStudent[_ad].branchIn = _branchIn;
        checkStudent[_ad].batch = _batch;
        checkStudent[_ad].sem = 1;
        checkStudent[_ad].class = _class;
        checkStudent[_ad].isStudent = true;
        students.push(_ad);
        branchStudent[_branchIn].push(_ad);
        classStudent[_class].push(_ad);
        // semStudent[_].push(_ad);
        return true;
    }
    
    // get all students' addresses
    function getStudents() public view returns(address[] memory){
        return students;
    }
    
    // get student from on branch
    function getBranchStudent(string memory _branch) public view returns(address[] memory){
        return branchStudent[_branch];
    }
    
    // get student from on branch
    function getClassStudent(string memory _class) public view returns(address[] memory){
        return classStudent[_class];
    }
    
    // store subjects
    mapping(address => uint128[]) public studentSubjects;
    
    // store subjects
    mapping(address => mapping(uint128 => bool)) public checkStudentSubjects;
    
    // get students subjects
    function getStudentSubs(address _studAd) public returns(uint128[] memory){
        require(checkStudent[_studAd].isStudent == true, "Invalid student");
        studentSubjects[_studAd] = getSub(checkStudent[_studAd].branchIn, checkStudent[_studAd].sem);
        for(uint128 i = 0 ; i < studentSubjects[_studAd].length; i++){
            checkStudentSubjects[_studAd][studentSubjects[_studAd][i]] = true;
        }
        return studentSubjects[_studAd];
    }
    
    /*end of students details*/
    
    /*Student Marks*/
    
    // store students' subjects' marks
    mapping(address=>mapping(uint128 => uint8)) public studentSubjectMarks;
    
    //enter subject marks by teacher
    function marks(address _studAd, uint128 _subject, uint8 _marks) public returns(bool){
        require(checkTeacher[msg.sender].isTeacher == true, "Not a teacher");
        require(checkStudent[_studAd].isStudent == true, "Invalid student");
        require(checkTeachSub[msg.sender][_subject] == true, "Teacher dont have this subject");
        require(checkStudentSubjects[_studAd][_subject] == true, "Student does not study this subject");
        studentSubjectMarks[_studAd][_subject] = _marks;
        return true;
    }
    
    //display marks
    uint8[] public disMarks;
    function showMarks(address _studAd) public returns(uint8[] memory){
        require(checkStudent[_studAd].isStudent == true, "Invalid student");
        delete disMarks;
        for(uint8 i = 0; i<studentSubjects[_studAd].length; i++){
            disMarks.push(studentSubjectMarks[_studAd][studentSubjects[_studAd][i]]);
        }
        return disMarks;
    }
    
    /*end of student marks*/
}
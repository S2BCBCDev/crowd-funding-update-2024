// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

contract CrowdCollab {
    struct Request {
        string description;
        uint256 amount;
        address payable recipient;
        bool complete;
        address[] approvals; // Using an array instead of a mapping
    }

    address public manager;
    uint256 public minimumContribution;
    string public campaignDescription;
    mapping(address => bool) public supporters;
    uint256 public numberSupporters;
    Request[] public requests;

    modifier managerOnly() {
        require(msg.sender == manager, "Only manager can call this function");
        _;
    }

    modifier supporterOnly() {
        require(
            supporters[msg.sender],
            "Only supporters can call this function"
        );
        _;
    }

    constructor(
        address creator,
        uint256 minContribution,
        string memory description
    ) {
        manager = creator;
        minimumContribution = minContribution;
        campaignDescription = description;
    }

    function contribute() public payable {
        require(
            msg.value > minimumContribution,
            "Contribution must be greater than minimum contribution"
        );
        supporters[msg.sender] = true;
        numberSupporters++;
    }

    function support() public payable {
        contribute();
    }

    function createRequest(
        string memory description,
        uint256 amount,
        address payable recipient
    ) public managerOnly {
        Request memory newRequest;
        newRequest.description = description;
        newRequest.amount = amount;
        newRequest.recipient = recipient;
        newRequest.complete = false;
        requests.push(newRequest);
    }

    function approveRequest(uint256 requestId) public supporterOnly {
        Request storage request = requests[requestId];
        require(!isApproved(request, msg.sender), "Request already approved");
        request.approvals.push(msg.sender);
    }

    function finalizeRequest(uint256 requestId) public managerOnly {
        Request storage request = requests[requestId];
        require(!request.complete, "Request already completed");
        require(
            request.approvals.length > (numberSupporters / 2),
            "Not enough approvals"
        );
        payable(request.recipient).transfer(request.amount);
        request.complete = true;
    }

    function getSummary()
        public
        view
        returns (uint256, uint256, uint256, uint256, address)
    {
        return (
            minimumContribution,
            address(this).balance,
            requests.length,
            numberSupporters,
            manager
        );
    }

    function getRequestsCount() public view returns (uint256) {
        return requests.length;
    }

    function isApproved(
        Request storage request,
        address approver
    ) internal view returns (bool) {
        for (uint256 i = 0; i < request.approvals.length; i++) {
            if (request.approvals[i] == approver) {
                return true;
            }
        }
        return false;
    }
}

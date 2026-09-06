pragma solidity ^0.5.0;

contract ServiceRating {
    struct Rating {
        address user;
        uint rating; // Rating out of 5 or any other scale
    }

    Rating[] public ratings;

    // Event to log when a service is rated
    event ServiceRated(address indexed user, uint rating);

    // Function to rate a service
    function rateService(uint _rating) public {
        require(_rating >= 0 && _rating <= 5, "Invalid rating"); // Assuming ratings are between 0 and 5

        Rating memory newRating = Rating(msg.sender, _rating);
        ratings.push(newRating);

        emit ServiceRated(msg.sender, _rating);
    }

    // Function to get the average rating of a service
    function getAverageRating() public view returns (uint) {
        uint totalRating = 0;
        uint count = 0;

        for (uint i = 0; i < ratings.length; i++) {
            totalRating += ratings[i].rating;
            count++;
        }

        if (count == 0) {
            return 0; // No ratings yet
        } else {
            return totalRating / count;
        }
    }
}

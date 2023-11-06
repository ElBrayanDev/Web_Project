//! Combo Box

document.addEventListener('DOMContentLoaded', (event) => {
    const ranks = [
        'Radiant',
        'Immortal 3',
        'Immortal 2',
        'Immortal 1',
        'Ascendant 3',
        'Ascendant 2',
        'Ascendant 1',
        'Diamond 3',
        'Diamond 2',
        'Diamond 1',
        'Platinum 3',
        'Platinum 2',
        'Platinum 1',
        'Gold 3',
        'Gold 2',
        'Gold 1',
        'Silver 3',
        'Silver 2',
        'Silver 1',
        'Bronze 3',
        'Bronze 2',
        'Bronze 1',
        'Iron 3',
        'Iron 2',
        'Iron 1'
    ];

    const selectBoxes = document.querySelectorAll('.rank-select');

    selectBoxes.forEach(selectBox => {
        ranks.forEach(rank => {
            const option = document.createElement('option');
            option.value = rank;
            option.text = rank;
            selectBox.appendChild(option);
        });
    });
});

//! Form submission
window.onload = function () {
    let teamData = JSON.parse(localStorage.getItem('teamData'));

    // Display the data
    document.getElementById('team_name').textContent = teamData.team_name;
    document.getElementById('player1Name').textContent = teamData.player1;
    document.getElementById('player1Rank').textContent = teamData.player1_rank;
    document.getElementById('player2Name').textContent = teamData.player2;
    document.getElementById('player2Rank').textContent = teamData.player2_rank;
    document.getElementById('player3Name').textContent = teamData.player3;
    document.getElementById('player3Rank').textContent = teamData.player3_rank;
    document.getElementById('player4Name').textContent = teamData.player4;
    document.getElementById('player4Rank').textContent = teamData.player4_rank;
    document.getElementById('player5Name').textContent = teamData.player5;
    document.getElementById('player5Rank').textContent = teamData.player5_rank;
    document.getElementById('player6Name').textContent = teamData.player6;
    document.getElementById('player6Rank').textContent = teamData.player6_rank;
    document.getElementById('player7Name').textContent = teamData.player7;
    document.getElementById('player7Rank').textContent = teamData.player7_rank;
};

document.getElementById('form').addEventListener('submit', function (e) {
    e.preventDefault();

    let formData = {
        team_name: document.getElementById('team_name').value,
        player1: document.getElementById('player1_name').value,
        player1_rank: document.getElementById('player1_rank').value,
        player2: document.getElementById('player2_name').value,
        player2_rank: document.getElementById('player2_rank').value,
        player3: document.getElementById('player3_name').value,
        player3_rank: document.getElementById('player3_rank').value,
        player4: document.getElementById('player4_name').value,
        player4_rank: document.getElementById('player4_rank').value,
        player5: document.getElementById('player5_name').value,
        player5_rank: document.getElementById('player5_rank').value,
        player6: document.getElementById('player6_name').value,
        player6_rank: document.getElementById('player6_rank').value,
        player7: document.getElementById('player7_name').value,
        player7_rank: document.getElementById('player7_rank').value
    };

    localStorage.setItem('teamData', JSON.stringify(formData));

    window.location.href = './teams.html';
});
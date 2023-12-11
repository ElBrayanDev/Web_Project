//! Combo Box

document.addEventListener('DOMContentLoaded', (event) => {
    const ranks = {
        'Radiant': '2500',
        'Immortal 3': '2400',
        'Immortal 2': '2300',
        'Immortal 1': '2200',
        'Ascendant 3': '2100',
        'Ascendant 2': '2000',
        'Ascendant 1': '1900',
        'Diamond 3': '1800',
        'Diamond 2': '1700',
        'Diamond 1': '1600',
        'Platinum 3': '1500',
        'Platinum 2': '1400',
        'Platinum 1': '1300',
        'Gold 3': '1200',
        'Gold 2': '1100',
        'Gold 1': '1000',
        'Silver 3': '900',
        'Silver 2': '800',
        'Silver 1': '700',
        'Bronze 3': '600',
        'Bronze 2': '500',
        'Bronze 1': '400',
        'Iron 3': '300',
        'Iron 2': '200',
        'Iron 1': '100'
    };

    const rankSelects = document.getElementsByClassName('rank-select');

    for (const rankName in ranks) {
        const rankId = ranks[rankName];
        const option = document.createElement('option');
        option.value = rankId;
        option.text = rankName;

        for (let i = 0; i < rankSelects.length; i++) {
            const select = rankSelects[i];
            select.appendChild(option.cloneNode(true));
        }
    }
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

    window.location.href = '/teams';
});
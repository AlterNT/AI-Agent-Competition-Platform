'strict mode'

document.getElementById('rt').addEventListener("click", getQuery);
document.getElementById('query').addEventListener("change", updateInfo);

async function apiResult(endpoint) {
    const serverUrl = 'http://localhost:8080';
    const apiCall = `${serverUrl}${endpoint}`

    // Header Setup
    // This is kinda cursed, would we not wanna use a json object?
    let headers = new Headers();
    headers.append("Accept", "application/json")
    headers.append('Access-Control-Allow-Origin', '*')
    headers.append("Accept-Language", "en-US,en;q=0.5")
    headers.append("Sec-Fetch-Dest", "empty")
    headers.append("Sec-Fetch-Mode", "no-cors")
    headers.append("Sec-Fetch-Site", "cross-site")
    headers.append("Pragma", "no-cache")
    headers.append("Cache-Control", "no-cache")

  
    return await fetch(apiCall, {
        "method": "GET",
        "credentials": "omit",
        "mode": "cors",
        "headers": headers,
    });
}

async function tabulateFromEndpoint(endpoint) {

    $('#renderer').html('Running');

    const result = await apiResult(endpoint);
    const resultJson = await result.json();
    const values = Object.values(resultJson)[0];
    const headers = Object.keys(values[0])
    headers.unshift('#');
    console.log(headers);

    function addAllColumnHeaders() {
        var headerTr$ = $('<tr/>');
        headers.forEach((header) => headerTr$.append($('<th/>').html(header)));
        $("#excelDataTable").append(headerTr$);
    };

    function buildHtmlTable() {
        addAllColumnHeaders();
        //For each item
        values.forEach((obs, i) => {
            console.log(obs)
            const row = $('<tr/>');
            const rowNum = (i + 1).toString();
            obs['#'] = rowNum;

            headers.forEach((header) => {
                const cellValue = $('<td/>').html(obs[header] ?? '')
                row.append(cellValue);
            })
            $("#excelDataTable").append(row);
        });
    };

    buildHtmlTable();
}

async function download_table_as_csv(table_id, separator = ',') {
    console.log('#' + table_id)

    // Select rows from table_id
    var rows = document.querySelectorAll('table#' + table_id + ' tr');

    // Construct csv
    var csv = [];
    for (var i = 0; i < rows.length; i++) {
        var row = [], cols = rows[i].querySelectorAll('td, th');
        for (var j = 0; j < cols.length; j++) {
            // Clean innertext to remove multiple spaces and jumpline (break csv)
            var data = cols[j].innerText.replace(/(\r\n|\n|\r)/gm, '').replace(/(\s\s)/gm, ' ')
            // Escape double-quote with double-double-quote
            data = data.replace(/"/g, '""');
            // Push escaped string
            row.push('"' + data + '"');
        }
        csv.push(row.join(separator));
    }
    var csv_string = csv.join('\n');
    
    // Download Table
    var filename = 'AI_Platform_Data' + '.csv';
    var link = document.createElement('a');
    link.style.display = 'none';
    link.setAttribute('target', '_blank');
    link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv_string));
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

async function renderTable(query) {
    tabulateFromEndpoint(query);
}

function getQuery() {

    $("tr").remove();

    var starter = "/api/";
    var q = $('#query').val();
    var id = $('#single').val();
    //console.log(q)
    
    const requestCalls = {'game': 'gameId', 'agent-games': 'agentId', 'winrate': 'agentId', 'improvement': 'agentId'};

    if (q in requestCalls) {
        console.log(requestCalls[q])
        qr = starter + q + "?" + requestCalls[q] + '=' + id
        console.log(qr)
        return qr
    }
    else {
        return starter + q
    }
}

function updateInfo() {
    var requestCallsList = ['game', 'agent-games', 'agentId', 'winrate', 'improvement', 'improvement-rate']
    var selected = $('#query').val();

    if (requestCallsList.includes(selected)) {
        $('#single').prop('disabled', false);
        console.log('in');
    }
    else {
        $('#single').prop('disabled', true);
        console.log('else');
    }

}
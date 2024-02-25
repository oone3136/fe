function clearForm() {
    document.getElementById('id').value = '';
    document.getElementById('namaLengkap').value = '';
    document.getElementById('jenisKelamin').value = '';
    document.getElementById('tanggalLahir').value = '';
    document.getElementById('negara').value = '';
}

async function performSearch() {
    const searchType = document.getElementById('searchType').value;
    const searchInput = document.getElementById('searchInput').value;

    try {
        const searchUrl = `http://localhost:8080/api/monitoring/byNama`;
        const requestBody = {
            nik: searchType,
            nama_lengkap: searchInput
        };

        const response = await fetch(searchUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
            
        });
        console.log(requestBody);
        const data = await response.json();

        console.log(data);

        const searchResultsDiv = document.getElementById('searchResults');
        searchResultsDiv.innerHTML = `<p>Hasil Pencarian untuk : ${searchType} ${searchInput}</p>`;
        displaySearchResults(data); 

    } catch (error) {
        console.error('Error:', error);
    }
}

function displaySearchResults(data) {
    const searchResultsDiv = document.getElementById('searchResults');
    searchResultsDiv.innerHTML = ''; 

    if (data.length === 0) {
        searchResultsDiv.innerHTML = '<p>Tidak ada hasil pencarian.</p>';
        return;
    }

    const resultTable = document.createElement('table');
    resultTable.innerHTML = `
        <thead>
            <tr>
                <th>ID</th>
                <th>Nama Lengkap</th>
                <th>Jenis Kelamin</th>
                <th>Tanggal Lahir</th>
                <th>Alamat</th>
                <th>Negara</th>
                <th>Aksi</th>
            </tr>
        </thead>
        <tbody id="resultTableBody"></tbody>
    `;
    searchResultsDiv.appendChild(resultTable);

    const resultTableBody = document.getElementById('resultTableBody');

    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.namaLengkap}</td>
            <td>${item.jenisKelamin}</td>
            <td>${item.tanggalLahir}</td>
            <td>${item.alamat}</td>
            <td>${item.negara}</td>
            <td>
                <button onclick="editData(${item.id})">Edit</button>
                <button onclick="detailData(${item.id})">Detail</button>
                <button onclick="deleteData(${item.id})">Hapus</button>
            </td>
        `;
        resultTableBody.appendChild(row);
    });
}

async function fetchData() {
    try {
        const response = await fetch('http://localhost:8080/api/monitoring');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}


function hitungUmur(tanggalLahir) {
    const tanggalSekarang = new Date();
    const tanggalLahirObj = new Date(tanggalLahir);
    const selisihTahun = tanggalSekarang.getFullYear() - tanggalLahirObj.getFullYear();
    if (
        tanggalSekarang.getMonth() < tanggalLahirObj.getMonth() ||
        (tanggalSekarang.getMonth() === tanggalLahirObj.getMonth() && tanggalSekarang.getDate() < tanggalLahirObj.getDate())
    ) {
        return selisihTahun - 1;
    } else {
        return selisihTahun;
    }
}

async function displayData() {
    try {
        const response = await fetch('http://localhost:8080/api/monitoring');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        const tableBody = document.getElementById('tableBody');
        tableBody.innerHTML = '';

        data.forEach(data => {
            const umur = hitungUmur(data.tanggalLahir);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${data.id}</td>
                <td>${data.namaLengkap}</td>
                <td>${data.jenisKelamin}</td>
                <td>${umur} </td>
                <td>${data.tanggalLahir}</td>
                <td>${data.alamat}</td>
                <td>${data.negara}</td>
                <td>
                    <button onclick="editData(${data.id})" class="btn btn-warning">Edit</button>
                    <button onclick="detailData(${data.id})" class="btn btn-info">Detail</button> 
                    <button onclick="deleteData(${data.id})" class="btn btn-danger">Hapus</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function displaySearchResults(data, searchType) {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';

    data.forEach(result => {
        const umur = hitungUmur(result.tanggalLahir);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${result.id}</td>
            <td>${result.namaLengkap}</td>
            <td>${result.jenisKelamin}</td>
            <td>${umur}</td>
            <td>${result.tanggalLahir}</td>
            <td>${result.alamat}</td>
            <td>${result.negara}</td>
            <td>
                <button onclick="editData(${result.id})" class="btn btn-warning">Edit</button>
                <button onclick="detailData(${data.id})" class="btn btn-info">Detail</button> 
                <button onclick="deleteData(${result.id})" class="btn btn-danger">Hapus</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

async function addData() {
    const id = document.getElementById('id').value;
    const namaLengkap = document.getElementById('namaLengkap').value;
    let jenisKelamin;
    const jenisKelaminElements = document.getElementsByName('jenisKelamin');
    for (const element of jenisKelaminElements) {
        if (element.checked) {
            jenisKelamin = element.value;
            break;
        }
    }
    const tanggalLahir = document.getElementById('tanggalLahir').value;
    const alamat = document.getElementById('alamat').value;
    const negara = document.getElementById('negara').value;

    try {
        const response = await fetch('http://localhost:8080/api/monitoring', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, namaLengkap, jenisKelamin, tanggalLahir, alamat, negara }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }

        alert('Data berhasil ditambahkan');
        displayData();
        clearForm();
        $('#createFormModal').modal('hide');

    } catch (error) {
        console.error('Error adding data:', error);
        alert(`Error: ${error.message}`);
    }
}

async function deleteData(id) {
    try {
        const confirmDelete = confirm("Apakah Anda yakin ingin menghapus data?");
        
        if (confirmDelete) {
        await fetch(`http://localhost:8080/api/monitoring/${id}`, {
            method: 'DELETE',
        });

        displayData();
        alert('Data berhasil dihapus');
        }
    } catch (error) {
        console.error('Error deleting data:', error);
    }
}
async function detailData(id) {
    try {
        const response = await fetch(`http://localhost:8080/api/monitoring/${id}`, {
            method: 'GET',
        });
        
        
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        document.getElementById('detailId').textContent = data.id;
        document.getElementById('detailNamaLengkap').textContent = data.namaLengkap;
        document.getElementById('detailJenisKelamin').textContent = data.jenisKelamin;
        document.getElementById('detailTanggalLahir').textContent = data.tanggalLahir;
        document.getElementById('detailAlamat').textContent = data.alamat;
        document.getElementById('detailNegara').textContent = data.negara;
        $('#detailModal').modal('show');
    } catch (error) {
        console.error('Error:', error);
    }
}




function editData(id) {
    fetch(`http://localhost:8080/api/monitoring/${id}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('editId').value = data.id;
            document.getElementById('editNamaLengkap').value = data.namaLengkap;
            document.getElementById('editJenisKelamin').value = data.jenisKelamin;
            document.getElementById('editTanggalLahir').value = data.tanggalLahir;
            document.getElementById('editAlamat').value = data.alamat;
            document.getElementById('editNegara').value = data.negara;

            $('#editFormModal').modal('show');
        })
        .catch(error => {
            console.error('Error fetching data for edit:', error);
        });
}

async function updateData() {
    const id = document.getElementById('editId').value;
    const namaLengkap = document.getElementById('editNamaLengkap').value;
    const jenisKelamin = document.getElementById('editJenisKelamin').value;
    const tanggalLahir = document.getElementById('editTanggalLahir').value;
    const alamat = document.getElementById('editAlamat').value;
    const negara = document.getElementById('editNegara').value;

    try {
        const response = await fetch(`http://localhost:8080/api/monitoring/${id}`, {
            method: 'PUT', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, namaLengkap, jenisKelamin, tanggalLahir, alamat, negara }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }

        alert('Data berhasil diupdate');
        displayData();
        clearForm();
        $('#editFormModal').modal('hide');

    } catch (error) {
        console.error('Error update data:', error);
        alert(`Error: ${error.message}`);
    }
}

displayData();

// Replace with your Render backend URL
const API_URL = 'https://nitroliftsupports.onrender.com';

// Fetch all parts
async function fetchParts() {
    try {
        const response = await axios.get(`${API_URL}/api/parts`);
        displayParts(response.data);
    } catch (error) {
        console.error('Error fetching parts:', error);
    }
}

// Display parts in the table
function displayParts(parts) {
    const tbody = document.querySelector('#partsTable tbody');
    tbody.innerHTML = '';
    parts.forEach(part => {
        const row = `
            <tr>
                <td class="p-2">${part.part_number}</td>
                <td class="p-2">${part.extended_length}</td>
                <td class="p-2">${part.stroke}</td>
                <td class="p-2">${part.force}</td>
                <td class="p-2">
                    <button onclick="editPart(${part.id})" class="bg-yellow-500 text-white px-2 py-1 rounded mr-2">Edit</button>
                    <button onclick="deletePart(${part.id})" class="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// Add a new part
document.getElementById('addPartForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const newPart = {
        part_number: document.getElementById('partNumber').value,
        extended_length: parseInt(document.getElementById('extendedLength').value),
        stroke: parseInt(document.getElementById('stroke').value),
        force: document.getElementById('force').value
    };

    try {
        await axios.post(`${API_URL}/api/parts`, newPart);
        fetchParts();
        e.target.reset();
    } catch (error) {
        console.error('Error adding part:', error);
    }
});

// Edit a part
async function editPart(id) {
    const part = await axios.get(`${API_URL}/api/parts/${id}`);
    const updatedPart = {
        part_number: prompt('Enter new part number:', part.data.part_number),
        extended_length: parseInt(prompt('Enter new extended length:', part.data.extended_length)),
        stroke: parseInt(prompt('Enter new stroke:', part.data.stroke)),
        force: prompt('Enter new force:', part.data.force)
    };

    try {
        await axios.put(`${API_URL}/api/parts/${id}`, updatedPart);
        fetchParts();
    } catch (error) {
        console.error('Error updating part:', error);
    }
}

// Delete a part
async function deletePart(id) {
    if (confirm('Are you sure you want to delete this part?')) {
        try {
            await axios.delete(`${API_URL}/api/parts/${id}`);
            fetchParts();
        } catch (error) {
            console.error('Error deleting part:', error);
        }
    }
}

// Initial fetch of parts when the page loads
fetchParts();

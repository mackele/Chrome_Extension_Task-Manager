const getTodaysDate = () => {
    const date = new Date()
    let day = date.getDate()
    let month = date.getMonth() + 1
    let year = date.getFullYear()

    let formatedDate = `${year}-${month}-${day}`
    return formatedDate
}

document.getElementById("due-date").value = getTodaysDate();

const addTaskFromUser = () => {
    console.log('Add button was clicked!')
}

document.getElementById('add-button').addEventListener('click', addTaskFromUser);


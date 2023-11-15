$(async function () {
    await principalInfo()
    userInfo()
})

const userFetch = {
    head: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer': null
    },
    principalInfo: async () => await fetch('api/users/current')
}

async function principalInfo() {
    let temp = ''
    const info = document.querySelector('#principalInfo')
    await userFetch.principalInfo()
        .then(res => res.json())
        .then(user => {
            temp += `
            <span style="color: white">
                <b>${user.email}</b> with roles: <span>${user.roles.map(r => ' ' + r.name)}</span>
            </span>
            `
        })
    info.innerHTML = temp
}

async function userInfo() {
    let temp = ''
    const table = document.querySelector('#userInfo tbody')
    await userFetch.principalInfo()
        .then(res => res.json())
        .then(user => {
            temp += `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.firstName}</td>
                    <td>${user.lastName}</td>
                    <td>${user.age}</td>
                    <td>${user.email}</td>
                    <td>${user.roles.map(r => ' ' + r.name)}</td>
                </tr>
                `
            table.innerHTML = temp
        })
}
const userCreateMock = {
  name: 'Stan',
  email: 'stan@marvel.com',
  password: 'spiderman123',
  phoneNumber: '+525512984512',
}

const userMock = {
  ...userCreateMock,
  lastname: 'Lee',
  picture: 'https://marvel.com/images/stan.png',
  biography: 'The best creator',
}

const usersList = [
  {
    name: 'Perter',
    email: 'peter@marvel.com',
    password: 'spiderverse001',
    phoneNumber: '+525512924512',
  },
  {
    name: 'Tony',
    email: 'tony@starck.com',
    password: 'ironman114',
    phoneNumber: '+525232924512',
  },
  {
    name: 'Steve',
    email: 'steve@marvel.com',
    password: 'iLoveBucky000',
    phoneNumber: '+525222924512',
  },
  {
    name: 'Thor',
    email: 'thor@asgard.com',
    password: 'bitchBoy101',
    phoneNumber: '+5421112366',
  },
]

module.exports = {
  userCreateMock,
  userMock,
  usersList,
}

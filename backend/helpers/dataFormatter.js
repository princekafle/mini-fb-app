

export function formatUserdata(data){
    return{
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      gender: data.gender,
      birthDay: data.birthDay,
      birthMonth: data.birthMonth,
      birthYear: data.birthYear,
      createdAt: data.createdAt,
      id: data.id,
      roles: data.roles,
    }
}
export default formatUserdata;
export default function Profile({ firstName, lastName, content }) {
  return (
    <div>
      <h2>Profile</h2>
      <p>First Name: {firstName}</p>
      <p>Last Name: {lastName}</p>
      <p>{content}</p>
    </div>
  )
}

import '../styles/UserCard.css';

function UserCard({ item }) {
  return (
    <article className="user-card">
      <h3>{item.name}</h3>
      <p>{item.role}</p>
    </article>
  );
}

export default UserCard;

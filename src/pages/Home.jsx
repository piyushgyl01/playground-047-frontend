import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";

export default function Home() {
  const { data, loading, error, refetch } = useFetch(
    `${import.meta.env.VITE_API_URL}/startups`
  );

  async function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete this startup?")) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/startups/${id}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          refetch();
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
  return (
    <main className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Startups List</h2>
        <Link to="/post" className="btn btn-success">
          Add New Startup
        </Link>
      </div>

      {loading && (
        <div className="d-flex justify-content-center align-items-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="d-flex justify-content-center align-items-center">
          <div className="alert alert-danger">{error}</div>
        </div>
      )}

      {data && data.length === 0 && (
        <div className="alert alert-info">
          No startups found. Add your first startup!
        </div>
      )}

      <div className="row">
        {data &&
          data.map((startup) => (
            <div className="col-md-12 mb-4 list-group" key={startup._id}>
              <div className="list-group-item list-group-item-action">
                <div className="d-flex w-100 justify-content-between">
                  <h5 className="mb-1">
                    {startup.name} by {startup.founder}
                  </h5>
                  <small className="text-body-secondary">
                    {new Date(startup.createdAt).toLocaleDateString()}
                  </small>
                </div>
                <p className="mb-1">{startup.description}</p>
                <Link
                  to={`/details/${startup._id}`}
                  className="btn btn-primary me-2 mt-2"
                >
                  View Details
                </Link>
                <button
                  className="btn btn-danger mt-2"
                  onClick={() => handleDelete(startup._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>
    </main>
  );
}

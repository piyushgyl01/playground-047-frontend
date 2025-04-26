import { useNavigate, useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Form({ isEdit }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    founder: "",
  });
  const [apiError, setApiError] = useState(null);

  const { data, loading, error } = useFetch(
    `${import.meta.env.VITE_API_URL}/startups/${id}`
  );

  useEffect(() => {
    if (data && isEdit) {
      setFormData({
        name: data?.name || "",
        description: data?.description || "",
        founder: data?.founder || "",
      });
    }
  }, [isEdit, data, id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError(null);

    try {
      if (isEdit) {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/startups/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        if (response.ok) {
          navigate(`/details/${id}`);
        } else {
          const errorData = await response.json();
          setApiError(errorData.message || "Failed to update startup");
        }
      } else {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/startups`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        if (response.ok) {
          const createdStartup = await response.json();
          navigate(`/details/${createdStartup._id}`);
        } else {
          const errorData = await response.json();
          setApiError(errorData.message || "Failed to create new startup");
        }
      }
    } catch (error) {
      console.log(error);
      setApiError("Network error occurred");
    }
  }

  return (
    <>
      {isEdit && loading ? (
        <div className="d-flex justify-content-center align-items-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="card shadow border-0">
          <div className="card-body p-4">
            <h2 className="card-title mb-4">
              {isEdit ? "Edit Startup" : "Add New Startup"}
            </h2>

            {(error || apiError) && (
              <div className="d-flex justify-content-center align-items-center">
                <div className="alert alert-danger">{error || apiError}</div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="form-label">
                  Startup Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  id="name"
                  placeholder="e.g., SpaceX"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <textarea
                  className="form-control"
                  name="description"
                  id="description"
                  placeholder="e.g., Aerospace manufacturer and space transportation services company..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={8}
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label htmlFor="founder" className="form-label">
                  Founder
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="founder"
                  id="founder"
                  placeholder="e.g., Elon Musk"
                  value={formData.founder}
                  onChange={(e) =>
                    setFormData({ ...formData, founder: e.target.value })
                  }
                  required
                />
              </div>
              <div className="d-flex gap-2">
                <Link
                  to={isEdit ? `/details/${id}` : "/"}
                  className="btn btn-secondary"
                >
                  Cancel
                </Link>
                <button type="submit" className="btn btn-primary">
                  {isEdit ? "Save Changes" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

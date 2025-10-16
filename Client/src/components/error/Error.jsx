import PropTypes from "prop-types";

function Error({ error }) {
  return (
    <div className="text-red-600">
      Error loading notes: {error?.message || "Unknown error"}
      <button
        className="ml-2 text-blue-500 hover:underline"
        onClick={() => window.location.reload()}
      >
        Retry
      </button>
    </div>
  );
}

Error.propTypes = {
  error: PropTypes.object,
};

export default Error;

import { useEffect, useState, useCallback } from "react";

const API_URL = "http://localhost:3000/activities";

const mergeUniqueById = (oldList, newList) => {
  const map = new Map();
  [...oldList, ...newList].forEach(item => { map.set(item._id, item);});
  return Array.from(map.values());
};

function ActivityFeed() {
  const [activities, setActivities] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [actorName, setActorName] = useState("");
  const [type, setType] = useState("");


  const fetchActivities = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const url = cursor ? `${API_URL}?cursor=${cursor}` : API_URL;
    const res = await fetch(url, {headers: { "x-tenant-id": "tenant-1" }});
    const json = await res.json();

    setActivities(prev => mergeUniqueById(prev, json.data));
    setCursor(json.nextCursor);
    setHasMore(!!json.nextCursor);
    setLoading(false);
  }, [cursor, loading, hasMore]);

  useEffect(() => {
    fetchActivities();
  }, []);

  const createActivity = async () => {
    if (!actorName || !type) return;
    const tempId = Date.now();
    const optimisticActivity = {
      _id: tempId,
      actorName,
      type,
      createdAt: new Date().toISOString(),
      optimistic: true
    };

    setActivities(prev => [optimisticActivity, ...prev]);
    setActorName("");
    setType("");

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-tenant-id": "tenant-1"
        },
        body: JSON.stringify({actorId: "u1",actorName,type})
      });

      const saved = await res.json();


      setActivities(prev =>
        prev.map(a => (a._id === tempId ? saved : a))
      );
    } catch (error) {
      setActivities(prev =>
        prev.filter(a => a._id !== tempId)
      );
    }
  };

  return (
    <div className="container mt-4">
      <div className="card mb-4">
        <div className="card-header">Create Activity</div>
        <div className="card-body">
          <div className="row g-2">
            <div className="col-md-5">
              <input
                className="form-control"
                placeholder="Actor name"
                value={actorName}
                onChange={e => setActorName(e.target.value)}
              />
            </div>

            <div className="col-md-5">
              <input
                className="form-control"
                placeholder="Activity type"
                value={type}
                onChange={e => setType(e.target.value)}
              />
            </div>

            <div className="col-md-2 d-grid">
              <button
                className="btn btn-primary"
                onClick={createActivity}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </div>


      <ul className="list-group">
        {activities.map(activity => (
          <li
            key={activity._id}
            className={`list-group-item ${
              activity.optimistic ? "opacity-50" : ""
            }`}
          >
            <div className="fw-bold">
              {activity.actorName}
            </div>
            <div>{activity.type}</div>
            <small className="text-muted">
              {new Date(activity.createdAt).toLocaleString()}
            </small>
          </li>
        ))}
      </ul>

      {loading && (
        <div className="text-center mt-3">
          <div className="spinner-border" />
        </div>
      )}

      {!loading && activities.length === 0 && (
        <p className="text-center mt-3">No activity yet</p>
      )}

      {!hasMore && (
        <p className="text-center mt-3 text-muted">
          No more activities
        </p>
      )}
    </div>
  );
}

export default ActivityFeed;

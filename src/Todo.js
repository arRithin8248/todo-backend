import { useEffect, useState } from "react";

export default function Todo() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState("");  
    const [editId, setEditId] = useState(-1);
    const [message, setMessage] = useState("");

    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");

    const apiUrl = "http://localhost:8000"; 

    const handleSubmit = () => {
        setError("");
        if (title.trim() !== '' && description.trim() !== '') { 
            fetch(apiUrl + "/todos", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({ title, description })
            }).then((res) => {
                if (res.ok) {
                    setTodos([...todos, { title, description }]);
                    setTitle("");
                    setDescription("");
                    setMessage("Item added successfully");
                    setTimeout(() => {
                        setMessage("");
                    }, 3000);
                } else {
                    setError("Unable to Create ToDo Item");
                }
            }).catch(() => {
                setError("Unable to Create ToDo Item");
            });
        }
    };

    useEffect(() => {
        getItems();
    }, []);

    const getItems = () => {
        fetch(apiUrl + "/todos")
            .then((res) => res.json())
            .then((res) => {
                setTodos(res);
            });
    };

    const handleEdit = (item) => {
        setEditId(item._id);
        setEditTitle(item.title);
        setEditDescription(item.description);
    };

    const handleDelete=(id)=>{
        if(window.confirm('Are you sure want to delete?')){
            fetch(apiUrl+'/todos/'+id,{
                method: "DELETE"
            })
            .then(()=>{
                const updatedTodos=todos.filter((item)=> item._id !== id);
                setTodos(updatedTodos)
            })
        }


    }

    const handleUpdate = () => {
    setError("");
    if (editTitle.trim() !== '' && editDescription.trim() !== '') {
        fetch(apiUrl + "/todos/" + editId, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: editTitle, description: editDescription })
        }).then((res) => {
            if (res.ok) {
                const updatedTodos = todos.map((item) => {
                    if (item._id === editId) {
                        // Return a new object instead of mutating
                        return {
                            ...item,
                            title: editTitle,
                            description: editDescription
                        };
                    }
                    return item;
                });
                setTodos(updatedTodos);
                setMessage("Item updated successfully");
                setTimeout(() => setMessage(""), 3000);
                setEditId(-1);
            } else {
                setError("Unable to Update ToDo Item");
            }
        }).catch(() => {
            setError("Unable to Update ToDo Item");
        });
    }
};


    const handleEditCancel = () => {
        setEditId(-1);
    };

    return <>
        <div className="row padding-3 bg-success text-light">
            <h1>ToDoList Project With MERN Stack</h1>
        </div>
        <div className="row">
            <h3>Add Item</h3>
            {message && <p className="text-success">{message}</p>}
            <div className="form-group d-flex gap-2">
                <input className="form-control" placeholder="Title" type="text" onChange={(e) => setTitle(e.target.value)} />
                <input className="form-control" placeholder="Description" type="text" onChange={(e) => setDescription(e.target.value)} />
                <button className="btn btn-dark" onClick={handleSubmit}>Submit</button>
            </div>
            {error && <p className="text-danger">{error}</p>}
        </div>
        <div className="row mt-3">
            <h3>Tasks</h3>
            <div className="col-md-6">
                    <ul className="list-group">
                {
                    todos.map((item) =>
                        <li key={item._id} className="list-group-item bg-info d-flex justify-content-between align-items-center my-2">
                            <div className="d-flex flex-column me-2">
                                {
                                    editId === -1 || editId !== item._id ? <>
                                        <span className="fw-bold">{item.title}</span>
                                        <span className="fw">{item.description}</span>
                                    </> : <>
                                        <div className="form-group d-flex gap-2">
                                            <input className="form-control" placeholder="Title" type="text" onChange={(e) => setEditTitle(e.target.value)} value={editTitle} />
                                            <input className="form-control" placeholder="Description" type="text" onChange={(e) => setEditDescription(e.target.value)} value={editDescription} />
                                        </div>
                                    </>
                                }
                            </div>
                            <div className="d-flex gap-2">
                                {
                                    editId === -1 || editId !== item._id ?
                                        <button className="btn btn-warning" onClick={() => handleEdit(item)}>Edit</button> :
                                        <button className="btn btn-dark" onClick={handleUpdate}>Update</button>
                                }
                                {
                                    editId === -1 ?
                                        <button className="btn btn-danger" onClick={()=>handleDelete(item._id)}>Delete</button> :
                                        <button className="btn btn-danger" onClick={handleEditCancel}>Cancel</button>
                                }
                            </div>
                        </li>)
                }
            </ul>
            </div>
        </div>
    </>
}

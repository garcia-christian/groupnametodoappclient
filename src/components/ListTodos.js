import React, { Fragment, useEffect, useState } from "react";
import EditTodo from "./EditTodos"
const ListTodos = ({setStatusU}) => {


    const [todos, setTodos] = useState([]);
    const [cats, setCat] = useState([]);
    const [categ, setCateg] = useState("")
    const [status, setStatus] = useState(true);
    

 
    const deleteTodo = async (id) => {
        try {
            const deleteTodo = await fetch(`https://sampletodoappserver.herokuapp.com/todos/${id}`, {
                method: "DELETE"

            });
            setTodos(todos.filter(todo => todo.todo_id !== id));
        } catch (err) {
            console.error(err.message)
        }


    }
    const updateCategory = async (id) => {
        try {
            const body = { categ }
            const updateProgress = await fetch(`https://sampletodoappserver.herokuapp.com/todos/category/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            })
       

            window.location = "/dashboard";
        } catch (err) {
            console.error(err.message)
        }
    }
   
    const getCategory = async () => {
        try {
            const respo = await fetch("https://sampletodoappserver.herokuapp.com/todos/category")
            const jData = await respo.json();

            setCat(jData)
   
        } catch (err) {
            console.error(err.message);
        }
    }
    async function getID(){

        try {
            const response = await fetch(`https://sampletodoappserver.herokuapp.com/dashboard`,{
                method: "GET",
                headers: {token: localStorage.token}
            });
            const pareRes = await response.json()

            return pareRes.user_id
        
        } catch (error) {
            console.error(error.message)
        }
        
      }


    const getTodos = async () => {
        try {
            const respo = await fetch("https://sampletodoappserver.herokuapp.com/todos")
            const jData = await respo.json();
            
            const ID = await getID();
         
                if(status==true){
                    const data = await jData.filter(todo => todo.user_id == null);
                  setTodos(data);
                } else  {
                    const data = await jData.filter(todo => todo.user_id == ID);
                    setTodos(data);
                
            }
            setStatusU(status)
            
        } catch (err) {
            console.error(err.message);
        }
    }

    useEffect(() => {
        setStatus(false)
        getTodos();
        getCategory();
        
        

    }, []);

   
  

    function convD(date) {
        const d = new Date(date)
        const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d)
        const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d)
        const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d)

        return `${mo}-${da}-${ye}`;
    }
    function convT(date) {
        const d = new Date(date)
        const tm = new Intl.DateTimeFormat('en', { timeStyle: 'short' }).format(d)
        return `${tm}`;
    };



    
    function allF(e){
        
        setStatus(e.target.checked)
   
        getTodos();
        
      
      
    }
    

    return <Fragment>
      
        <div className="mt-3 d-flex">
            <h5 className="mr-3">Public</h5>
            <label 
            
             class="switch ">

                <input  onChange={  e => allF(e)}
                 
              id="checkbox" type="checkbox" />
                

                <span class="slider round"></span>
            </label>
           
            <h5 className="ml-3">Personal</h5>
        </div>

       
        <table class="table text-center table-dark">
            <thead>
                <tr>
                    <th scope="col">Description</th>
                    <th scope="col">Notes</th>
                    <th scope="col">Category</th>
                    <th scope="col">Date</th>
                    <th scope="col">Time</th>
                    <th scope="col">Edit</th>
                    <th scope="col">Delete</th>
                </tr>
            </thead>
            <tbody>

                {todos.map(todo => (
                    <tr key={todo.todo_id}>
                        <td>{todo.todo_desc}</td>
                        <td>{todo.todo_notes}</td>
                        <td>
                            <select id="dsd" onClick={() => updateCategory(todo.todo_id)} class="browser-default custom-select bg-dark text-light"
                                onChange={e => {

                                    setCateg(e.target.value);
                                }} value={todo.cat_id} >
                                <option selected>Select Category</option>

                                {cats.map((category) =>
                                    <option value={category.cat_id}> {category.category} </option>
                                )}

                            </select>


                        </td>
                        <td>{convD(todo.todo_date)}</td>
                        <td>{convT(todo.todo_date)}</td>
                        <td><EditTodo todo={todo} /></td>
                        <td><button className="btn btn-outline-danger" onClick={() => deleteTodo(todo.todo_id)}>Delete</button></td>
                    </tr>
                ))}
            </tbody>
        </table>

    </Fragment>
    
};

export default ListTodos;
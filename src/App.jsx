import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getNotes, createNote, updateNote } from "./requests"

const App = () => {
  const queryClient = useQueryClient()
  const newNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: (newNote) => {
      // incase to optimize performance manually update the query state maintained by react query
      const notes = queryClient.getQueryData(['notes'])
      queryClient.setQueryData(['notes'], notes.concat(newNote))


      // queryClient.invalidateQueries({ queryKey: ['notes'] })
    }
  })
  const toggleMutation = useMutation({
    mutationFn: updateNote,
    onSuccess: (changedNote) => {
      // incase to optimize performance manually update the query state maintained by react query
      const notes = queryClient.getQueryData(['notes'])
      queryClient.setQueryData(['notes'], notes.map(note => note.id !== changedNote.id ? note : changedNote))


      // queryClient.invalidateQueries({ queryKey: ['notes'] })
    }
  })

  const addNote = async (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    newNoteMutation.mutate({ content, important: false })
  }

  const toggleImportance = (note) => {
    const changedNote = {
      ...note,
      important: !note.important
    }
    toggleMutation.mutate(changedNote)
  }

  const result = useQuery({
    queryKey: ['notes'],
    queryFn: getNotes,
    refetchOnWindowFocus: false
    // queryFn: () => axios.get('http://localhost:3001/notes').then(res => {
    //   // console.log(res.data)
    //   return res.data
    // })
  })
  // console.log(result, 'before')
  console.log(JSON.parse(JSON.stringify(result)))

  if (result.isLoading) {
    return <div>
      <h2>Notes app</h2>
      <form >
        <input name="note" />
        <button type="submit">add</button>
      </form>
      loading data...
    </div>
  }

  const notes = result.data

  return (
    <div>
      <h2>Notes app</h2>
      <form onSubmit={addNote}>
        <input name="note" />
        <button type="submit">add</button>
      </form>
      {notes.map(note =>
        <li key={note.id} onClick={() => toggleImportance(note)}>
          {note.content}
          <strong> {note.important ? 'important' : ''}</strong>
        </li>
      )}
    </div>
  )
}

export default App
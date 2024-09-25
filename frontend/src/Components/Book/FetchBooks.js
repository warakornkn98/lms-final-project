const [books, setBooks] = useState([]);
const [bookData, setBookData] = useState({
    book_id: null,
    title : "",
    description: "",
    category_id: 0,
    author_id: 0,
    publisher_id: 0,
    publication_year: "",
    cover_image: "",
    isbn: "",
    pages: 0,
    price: 0.00,
    quantity: 0,
    date_added: null
});
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [isEditing, setIsEditing] = useState(false);

const fetchBooks = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/books");
    setBooks(response.data);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchBooks();
}, []);

const handleFormChange = (e) => {
  const { name, value } = e.target;
  setBookData({ ...bookData, [name]: value });
};

const handleSubmit = async () => {
  if (isEditing) {
    await updateBook();
  } else {
    await createBook();
  }
};

const createBook = async () => {
  try {
    const response = await axios.post("http://localhost:5000/api/books", bookData);
    setBooks([...books, response.data]);
    resetForm();
  } catch (err) {
    setError(err.message);
  }
};

const updateBook = async () => {
  try {
    const response = await axios.put(
      `http://localhost:5000/api/books/${bookData.book_id}`,
      bookData
    );
    setBooks(
      books.map((book) =>
        book.book_id === bookData.book_id ? response.data : book
      )
    );
    resetForm();
  } catch (err) {
    setError(err.message);
  }
};

const deleteBook = async (book_id) => {
  try {
    await axios.delete(`http://localhost:5000/api/books/${book_id}`);
    setBooks(books.filter((book) => book.book_id !== book_id));
  } catch (err) {
    setError(err.message);
  }
};

const handleEdit = (book) => {
  setBookData(book);
  setIsEditing(true);
};

const resetForm = () => {
  setBookData({
    book_id: null,
    title : "",
    description: "",
    category_id: 0,
    author_id: 0,
    publisher_id: 0,
    publication_year: "",
    cover_image: "",
    isbn: "",
    pages: 0,
    price: 0.00,
    quantity: 0,
    date_added: null
  });
  setIsEditing(false);
};

if (loading) return <p>Loading...</p>;
if (error) return <p>Error: {error}</p>;

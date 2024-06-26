import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import placeholderImage from "../placeholder.svg";

export default function Home() {
  const [userPrompt, setUserPrompt] = useState({
    author: "",
    bookTitle: "",
  });

  const [results, setResults] = useState([]);

  //   const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function handleInputChange(e) {
    const updatedUserPrompt = { ...userPrompt };
    const id = e.target.id;
    const value = e.target.value;
    switch (id) {
      case "author":
        updatedUserPrompt.author = value;
        break;
      case "book-title":
        updatedUserPrompt.bookTitle = value;
        break;
    }
    setUserPrompt(updatedUserPrompt);
  }

  function handleButtonClick(e) {
    e.preventDefault();
    const id = e.target.id;
    console.log({ id, userPrompt });
    switch (id) {
      case "clear-search":
        clearSearchInputs();
        break;
      case "search":
        search();
        break;
    }
  }

  function clearSearchInputs() {
    setUserPrompt({
      author: "",
      bookTitle: "",
    });
    setResults([]);
  }

  async function fetchBookDetails(author, bookTitle) {
    try {
      let allBooks = [];
      let startIndex = 0;
      let hasMoreResults = true;

      while (hasMoreResults) {
        const url = `https://www.googleapis.com/books/v1/volumes?q=${bookTitle}+inauthor:${author}&startIndex=${startIndex}`;
        const response = await axios.get(url);
        const books = response.data.items;

        if (books && books.length > 0) {
          allBooks = [...allBooks, ...books];
          startIndex += books.length;
        } else {
          hasMoreResults = false;
        }
      }

      return allBooks;
    } catch (error) {
      console.error("Error fetching book details:", error);
      return [];
    }
  }

  async function search(
    author = userPrompt.author,
    bookTitle = userPrompt.bookTitle,
  ) {
    setIsLoading(true);
    const books = await fetchBookDetails(author, bookTitle);
    setResults(books);
    setIsLoading(false);
    console.log(books);
  }

  return (
    <>
      <header>
        <h1 className="w-full bg-zinc-900 p-5 text-center font-black text-zinc-200">
          Book Search Engine
        </h1>
        <form className="flex w-full flex-col items-center justify-center gap-8 bg-zinc-300 p-5 md:flex-row">
          <div className="flex flex-row gap-1">
            <input
              id="author"
              type="text"
              placeholder="Author"
              className="w-full rounded-l-full border border-zinc-500 px-6 py-4"
              onChange={handleInputChange}
              value={userPrompt.author}
            />
            <input
              id="book-title"
              type="text"
              placeholder="Book Title"
              className="w-full rounded-r-full border border-zinc-500 px-6 py-4"
              onChange={handleInputChange}
              value={userPrompt.bookTitle}
            />
          </div>
          <div className="flex flex-row gap-4">
            <button
              id="search"
              className="w-fit rounded-full bg-zinc-800 px-10 py-4 font-bold text-zinc-200"
              onClick={handleButtonClick}
            >
              Search
            </button>
            <button
              id="clear-search"
              className="underline"
              onClick={handleButtonClick}
            >
              Clear Search
            </button>
          </div>
        </form>
      </header>
      <main className="flex min-h-screen flex-col items-center">
        <div className="flex flex-col items-center gap-12 px-6 py-12 md:p-12">
          <h2 className="text-2xl font-bold">Results:</h2>
          <div>
            {isLoading ? (
              <div>Search results loading...</div>
            ) : (
              <ul className="flex flex-row flex-wrap justify-center gap-8 md:gap-16">
                {results.map((book) => {
                  const id = uuidv4();
                  const title = book.volumeInfo.title;
                  const thumbnail =
                    book.volumeInfo.imageLinks?.thumbnail || placeholderImage;
                  const infoLink = book.volumeInfo.infoLink;
                  return (
                    <li key={id} className="flex w-[128px] flex-col gap-4">
                      <img src={thumbnail} alt={`Thumbnail for ${title}`} />
                      <a
                        href={infoLink}
                        className="h-12 overflow-hidden underline"
                      >
                        {title}
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </main>
      <footer className="w-full bg-black p-4 text-center text-sm text-zinc-400">
        Copyright (c) Baberr.com
      </footer>
    </>
  );
}

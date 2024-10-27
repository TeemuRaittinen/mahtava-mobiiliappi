import SQLite from 'react-native-sqlite-storage';

// Avaa SQLite-tietokanta (luo uuden, jos sitä ei ole)
const db = SQLite.openDatabase(
  { name: 'articles.db', location: 'default' },
  () => console.log("Database opened successfully"),
  error => console.error("Error opening database:", error)
);

// Alustetaan taulut
export const initializeDatabase = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS articles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        content TEXT
      );`,
      [],
      () => console.log("Articles table created successfully"),
      error => console.error("Error creating articles table:", error)
    );

    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        articleId INTEGER,
        commentText TEXT,
        FOREIGN KEY (articleId) REFERENCES articles(id) ON DELETE CASCADE
      );`,
      [],
      () => console.log("Comments table created successfully"),
      error => console.error("Error creating comments table:", error)
    );
  });
};

// Function to check if an article is saved
export const isArticleSaved = (title, callback) => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM articles WHERE title = ?',
      [title],
      (_, result) => {
        callback(result.rows.length > 0); // Call the callback with true if the article is found
      },
      (_, error) => {
        console.error('Error checking saved article', error);
        callback(false); // In case of error, call with false
      }
    );
  });
};


// Lisää uusi artikkeli
export const saveArticle = (title, description, content, callback) => {
  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO articles (title, description, content) VALUES (?, ?, ?);',
      [title, description, content],
      (_, result) => {
        callback(result.insertId); // Palauttaa uuden artikkelin ID
      },
      (_, error) => {
        console.error("Failed to save article:", error);
      }
    );
  });
};

// Lisää kommentti artikkeliin
export const addComment = (articleId, commentText, callback) => {
  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO comments (articleId, commentText) VALUES (?, ?);',
      [articleId, commentText],
      (_, result) => {
        callback(result);
      },
      (_, error) => {
        console.error("Failed to add comment:", error);
      }
    );
  });
};

// Hae tallennetut artikkelit ja niiden kommentit
export const getSavedArticles = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT articles.id AS articleId, articles.title, articles.description, articles.content, comments.id AS commentId, comments.commentText
         FROM articles
         LEFT JOIN comments ON articles.id = comments.articleId;`,
        [],
        (_, { rows }) => {
          resolve(rows.raw()); // Palauttaa artikkelit ja kommentit
        },
        (_, error) => {
          console.error("Failed to retrieve saved articles:", error);
          reject(error);
        }
      );
    });
  });
};

// Päivitä kommentti
export const updateComment = (commentId, newText, callback) => {
  db.transaction(tx => {
    tx.executeSql(
      'UPDATE comments SET commentText = ? WHERE id = ?;',
      [newText, commentId],
      (_, result) => {
        callback(result);
      },
      (_, error) => {
        console.error("Failed to update comment:", error);
      }
    );
  });
};

// Poista artikkeli ja siihen liittyvät kommentit
export const deleteArticle = (articleId, callback) => {
  db.transaction(tx => {
    tx.executeSql(
      'DELETE FROM articles WHERE id = ?;',
      [articleId],
      (_, result) => {
        callback(result);
      },
      (_, error) => {
        console.error("Failed to delete article:", error);
      }
    );
  });
};

// Poista kommentti
export const deleteComment = (commentId, callback) => {
  db.transaction(tx => {
    tx.executeSql(
      'DELETE FROM comments WHERE id = ?;',
      [commentId],
      (_, result) => {
        callback(result);
      },
      (_, error) => {
        console.error("Failed to delete comment:", error);
      }
    );
  });
};

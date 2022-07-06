You are going to build your own API! Your API will support standard CRUD operations (Create, Read, Update, Delete). The data will be read and saved to a JSON file.

# Getting Started

In this project you will work with a list of "students"
Each student object will include the following properties:

- id (unique id of student)
- firstName
- lastName
- createdOn (date/time student was created)
- updatedOn (date/time student was updated)
- grade
- classes (array of strings. i.e. ["Math", "History", "Art", etc])

## Requirements

All methods must handle success and failed responses.

### 🛠 Part 1

- The API must support CRUD operations (create, read, update and delete students)
- Data will be saved and read from a json file.
- CREATE method
  - Create a function that generates a unique 10 character id. This will be used when a student is created.
  - Validate the request body to assure all required properties are present. (See "Getting Started, #2 for properties).
- Read method
  - Get the full list of students
- Update Method
  - Validate the request body to assure all required properties are present. (See "Getting Started, #2 for properties).
  - Only update the properties that changed values.
  - Student object must be timestamp with the date/time it was updated
- Delete method
  - Delete student from the "students" list.

### 🛠 Part 2

- Add a `sort` parameter to the "GET" request. If "asc", return student list alphabetically by last name. If "desc", vise versa. (i.e. `/students?sort=asc`)
- Add a `limit` parameter to the "GET" request. The assigned number should limit the return results. (i.e. if there is a list of 10 students, `/students?limit=6` should return 6 of the 10 students.
- Combine the parameters 🙌🏻 sort and limit the "GET" request. (i.e. `/students?sort=desc&limit=5`)

### 🛠 Part 3 [optional]

- Create CRUD operations for the students "classes" property.
  - Get the list of classes for a given student
  - Add or Delete classes for a given student
  - Update classes for a given student

import React from 'react'

const Part = (props) => {
    return (
      <>
      <p>
          {props.part} {props.exercises}
      </p>
      </>
    );
  }

const Header = (props) => {
    return (
      <>
      <h1>{props.course}</h1>
      </>
    );
  }


  const Content = (props) => {
    return (
      <>
      {/* checks if parts exist */}
        {props.parts && props.parts.map(part => (
          <Part key={part.id} part={part.name} exercises={part.exercises} />
        ))}
      </>
    );
  };



const Total = (props) => {
    if (props.parts){
        const total = props.parts.reduce(((s, p) =>  s + p.exercises),0)
        return (
            <>
              <p><b>total of {total} exercises</b></p>
            </>
          );
    }
}

const Course = ({ course }) => {
    return (
      <>
        {course && course.map(course => (
          <div key={course.id}>
            <Header course={course.name} />
            <Content parts={course.parts} />
            <Total parts={course.parts} />
          </div>
        ))}
      </>
    );
  };


export default Course
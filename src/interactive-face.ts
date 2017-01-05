export class InteractiveFace{
  selectedIndex = 0;

  articles = [
    {
      title: "Java",
      description: 'Java is a general-purpose computer programming language that is concurrent, class-based, object-oriented, and specifically designed to have as few implementation dependencies as possible. It is intended to let application developers "write once, run anywhere" (WORA), meaning that compiled Java code can run on all platforms that support Java without the need for recompilation. Java applications are typically compiled to bytecode that can run on any Java virtual machine (JVM) regardless of computer architecture. As of 2016, Java is one of the most popular programming languages in use, particularly for client-server web applications, with a reported 9 million developers. Java was originally developed by James Gosling at Sun Microsystems (which has since been acquired by Oracle Corporation) and released in 1995 as a core component of Sun Microsystems\' Java platform. The language derives much of its syntax from C and C++, but it has fewer low-level facilities than either of them.'
    },
    {
      title: "JavaScript",
      description: 'JavaScript is a high-level, dynamic, untyped, and interpreted programming language. It has been standardized in the ECMAScript language specification. Alongside HTML and CSS, JavaScript is one of the three core technologies of World Wide Web content production; the majority of websites employ it, and all modern Web browsers support it without the need for plug-ins. JavaScript is prototype-based with first-class functions, making it a multi-paradigm language, supporting object-oriented, imperative, and functional programming styles. It has an API for working with text, arrays, dates and regular expressions, but does not include any I/O, such as networking, storage, or graphics facilities, relying for these upon the host environment in which it is embedded.'
    },
    {
      title: "TypeScript",
      description:
        `
        TypeScript is a free and open-source programming language developed and maintained by Microsoft. It is a strict superset of JavaScript, and adds optional static typing and class-based object-oriented programming to the language. Anders Hejlsberg, lead architect of C# and creator of Delphi and Turbo Pascal, has worked on the development of TypeScript. TypeScript may be used to develop JavaScript applications for client-side or server-side (Node.js) execution.
        TypeScript is designed for development of large applications and transcompiles to JavaScript. As TypeScript is a superset of JavaScript, any existing JavaScript programs are also valid TypeScript programs.
        TypeScript supports definition files that can contain type information of existing JavaScript libraries, much like C/C++ header files can describe the structure of existing object files. This enables other programs to use the values defined in the files as if they were statically typed TypeScript entities. There are third-party header files for popular libraries like jQuery, MongoDB, and D3.js. TypeScript headers for the Node.js basic modules are also available, allowing development of Node.js programs within TypeScript.
        `
    }
  ];

  //TODO: Remove this as soon as three.js/Chrome issue https://github.com/mrdoob/three.js/issues/10226 is fixed
  /*
  attached(){
    if (navigator.appVersion.indexOf("Chrome/") != -1) {
      this.articlesDiv.style.transform = 'scale('+(2/3)+')';
    }
  }
  */
}

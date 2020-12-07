const quiz1 = [
    { certId: 'HTML5', title: 'HTML5 Certification', qCount: 10 },
    {
        question: 'Which of the following tags, available in HTML5, is used to define an abbreviation, acronym, or suffix like "Dr.", "Mr.", etc?', 
        options: ['<acronym>', '<pre>', '<abbr>', '<alias>'],
        answer: 0
    },
    {
        question: 'What is different about the < sup > tag, used to define superscript text, between HTML5 and HTML 4.01?',
        options: [
            'In HTML5, it defines subscript text as well as superscript.',
            'It exists only in HTML5 and not in earlier versions.',
            'There are no differences.',
            'It exists in earlier versions, but not in HTML5.'],
        answer: 2
    },
    {
        question: 'Which of the following tags is new in HTML5?',
        options: ['<param>','<map>','<area>','<audio>'],
        answer: 3
    },
    {
        question: 'What is different about the < cite > tag between HTML5 and HTML 4.01?',
        options: [
            'In HTML 4.01, it defines the title of a work while in HTML5, it defines a citation.',
            'There are no differences.',
            'It exists only in HTML5 and not in earlier versions.',
            'In HTML5, it defines the title of a work while in HTML 4.01, it defines a citation.'],
        answer: 3
    },
    {
        question: 'Which of the following is true of the < applet > tag and HTML5?',
        options: [
            'It only works with Java applets.',
            'It has been replaced by < embed > or < object >.',
            'It works in most browsers without the need for additional plugins.',
            'Sizing within it must be expressed in terms of pixels.'],
        answer: 1
    },
    {
        question: 'Which of the following tags is new to HTML5 and used to specify where in a text a line-break can be added?',
        options: ['< wbr >','< linefeed >','< option >','< break >'],
        answer: 0
    },
    {
        question: 'Which of the following is true of < blockquote > and HTML5?',
        options: [
            'This tag is new to HTML5.',
            'This tag is not supported in HTML5.',
            'This tag is used to specify a section quoted from another source.',
            'This tag is used to define a long quotation.'],
        answer: 2
    },
    {
        question: 'Which tag is used to define parameters for plugins?',
        options: ['<param>','<feed>','<agent>','<send>'],
        answer: 0
    },
    {
        question: 'Which of the following tags is new to HTML5 and used to specify text (such as subtitles) to be visible when media is playing?',
        options: ['<always>','<caption>','<track>','<alt>'],
        answer: 2
    },
    {
        question: 'Which of the following < input > attributes is not new to HTML5?',
        options: ['autofocus','height','maxlength','autocomplete'],
        answer: 0
    }
]

const quiz2 = [
    { certId: 'Java', title: 'Java Certification', qCount: 10 },
    {
        question: 'At this point in time, which of the following is the officially supported version of Java?', 
        options: ['Java 9','Java 6','Java 6.5','Java 7','Java 8'],
        answer: 4
    },
    {
        question: 'Which keyword keeps the main method from returning any value to the caller?',
        options: ['restricted','void','exclusive','concealed'],
        answer: 1
    },
    {
        question: 'You need to reference a value stored in an array named B in row 7 column 3. Which syntax is correct within Java for finding the value of this variable?',
        options: ['B[3,7]','B[3][7]','B[7,3]','B[7][3]'],
        answer: 2
    },
    {
        question: 'You are having a problem with the “if” logic in your code and need to utilize case conditions to create a number of possible execution paths. Which statement is necessary to accomplish this?',
        options: ['instance','task','switch','swap'],
        answer: 2
    },
    {
        question: 'Within Java, each call to StdOut.println () does which of the following?',
        options: [
            'Appends text to the end of the file',
            'Overwrites the current contents of the file',
            'Prints the contents of the current file',
            'Reads and then prints the contents of the current file'],
        answer: 0
    },
    {
        question: 'Which company now owns Java?',
        options: ['SAP','Apache Software Foundation','Oracle Corporation','PeopleSoft Inc.'],
        answer: 3
    },
    {
        question: 'Within Java, you need to code your program so that under certain conditions it will skip the current iteration of a for loop. What can be used to accomplish this?',
        options: ['swipe','continue','jump','skip'],
        answer: 1
    },
    {
        question: 'There are numerous ways of adding comments to code written in Java. Which of the following is an accepted method of commenting a line in Java?',
        options: ['*', '//', '##', '!'],
        answer: 1
    },
    {
        question: 'According to Boolean operations, if !g is true, then which of the following applies?',
        options: [
            'If g is false, and true otherwise',
            'If g is true, and false otherwise',
            'If g is true, and true otherwise',
            'If g is false, and false otherwise'],
        answer: 1
    },
    {
        question: 'Which of the following individuals is credited for first designing Java?',
        options: ['James Gosling','Tim Ritchey','Ian Sheeler','Jim LeValley'],
        answer: 0
    }
]
const quiz3 = [
    { certId: 'Python', title: 'Python Certification', qCount: 10 },
    {
        question: 'In Python, which of the following can call code before or after a function without modifying the code within the function', 
        options: ['helper','snippet','decorator','border'],
        answer: 2
    },
    {
        question: 'Within Python, scope is delineated by:',
        options: ['variables and arguments', 'bariables and function', 'arguments and class blocks', 'Function and class blocks'],
        answer: 3
    },
    {
        question: 'Within Python, which character can be used to continue code from one line onto another (the “continuation” character)?',
        options: ['Backslash','#','%','@'],
        answer: 0
    },
    {
        question: 'Which function can be used to iterate multiple sequences AND stop when the shortest sequence is exhausted?',
        options: ['zip()','range()','for_range()','for()'],
        answer: 0
    },
    {
        question: 'In working with regular expressions, what is a primary difference between “search” and “findall”?',
        options: [
            'The findall() finds all occurrences and, search() just finds the first one.',
            'The search() will replace what it finds, while findall() only reports what it finds.',
            'There is no difference: they are synonyms within Python.',
            'Python 2.x uses search() and Python 3.x uses findall().',
            'The search() will show all results, while findall() merely counts the number of matches.'],
        answer: 0
    },
    {
        question: 'To prevent the displayed output from appearing too quickly for a user to process, a programmer must add a delay of seven seconds in the coding. Which of the following calls can accomplish this?',
        options: ['delay(7)','wait(7)','time(7)','sleep(7)'],
        answer: 3
    },
    {
        question: 'In working with regular expressions, which pattern can be used to match a whitespace character?',
        options: ['b','s','a','w'],
        answer: 1
    },
    {
        question: 'Which of the following will create a class called GLASS?',
        options: ['class GLASS:','class: GLASS','class: GLASS:','class(GLASS)'],
        answer: 0
    },
    {
        question: 'What is a primary difference between a list and a tuple?',
        options: [
            'Tuples are mutable.',
            'Tuples are created with square brackets.',
            'Tuples cannot be changed.',
            'Tuples use more space.',
            'Tuples can only store numeric data.'],
        answer: 2
    },
    {
        question: 'Within Python, an anonymous function expressed as a single statement is known as which of the following?',
        options: ['decorator()','delta()','lambda()','short()'],
        answer: 0
    }
]
const quiz4 = [
    { certId: 'Test', title: 'Example Certification', qCount: 5 },
    {
        question: 'Question 1',
        options: ['Correct', 'Incorrect', 'Incorrect', 'Incorrect'],
        answer: 0
    },
    {
        question: 'Question 2',
        options: ['Correct', 'Incorrect', 'Incorrect', 'Incorrect'],
        answer: 0
    },
    {
        question: 'Question 3',
        options: ['Correct', 'Incorrect', 'Incorrect', 'Incorrect'],
        answer: 0
    },
    {
        question: 'Question 4',
        options: ['Correct', 'Incorrect', 'Incorrect', 'Incorrect'],
        answer: 0
    },
    {
        question: 'Question 5',
        options: ['Correct', 'Incorrect', 'Incorrect', 'Incorrect'],
        answer: 0
    }
]

const quizes = [quiz1, quiz2, quiz3, quiz4]
export default quizes;
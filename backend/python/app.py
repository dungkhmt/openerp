from flask import Flask, jsonify
app = Flask(__name__)

course = [{'id':'IT3010','name':'DSA'},{'id':'IT3010','name':'Toán rời rạc'}]

@app.route('/')
def index():
	return '<h1>Welcome</h1><button onClick={handleClick}>Click me</button>'
	
@app.route('/courses',methods=['GET'])
def getCourses():
	return jsonify({'courses': course});
	
if __name__ == "__main__":
	app.run(debug=True)
from flask import Flask, request, jsonify
import openai

app = Flask(__name__)

# تعيين مفتاح API الخاص بك من OpenAI
openai.api_key = 'YOUR_OPENAI_API_KEY'

# دالة للرد على الأسئلة باستخدام OpenAI
@app.route('/ask', methods=['POST'])
def ask():
    user_input = request.json['message']
    
    try:
        # إرسال الرسالة إلى OpenAI API
        response = openai.Completion.create(
            engine="text-davinci-003",
            prompt=user_input,
            max_tokens=50
        )
        ai_response = response.choices[0].text.strip()
    except Exception as e:
        ai_response = "عذرًا، حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى."

    return jsonify({'response': ai_response})

if __name__ == '__main__':
    app.run(debug=True)
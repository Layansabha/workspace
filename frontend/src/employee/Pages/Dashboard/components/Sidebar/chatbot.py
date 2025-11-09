from chatterbot import ChatBot
from chatterbot.trainers import ChatterBotCorpusTrainer

# إنشاء شات بوت
chatbot = ChatBot('MyBot')

# تدريب الشات بوت على البيانات الأساسية
trainer = ChatterBotCorpusTrainer(chatbot)
trainer.train("chatterbot.corpus.english.greetings", "chatterbot.corpus.english.conversations")

# إضافة ردود مخصصة للأسئلة الشائعة
custom_responses = {
    "ما هو اسمك؟": "أنا شات بوت ذكي.",
    "كيف حالك؟": "أنا بخير، شكرًا لسؤالك!",
    "ما هو الطقس اليوم؟": "أنا لست متأكدًا، لكن يمكنك التحقق من تطبيق الطقس.",
    "ما هي عاصمة فرنسا؟": "عاصمة فرنسا هي باريس.",
    "ما هي اللغة الأكثر شيوعًا في العالم؟": "اللغة الأكثر شيوعًا هي الماندرين الصينية.",
    "ما هو أفضل نظام تشغيل؟": "هذا يعتمد على احتياجاتك، ولكن Windows و macOS و Linux كلها خيارات رائعة.",
}

# دالة للرد على الأسئلة
def get_response(user_input):
    if user_input.lower() in ["hi", "hello", "مرحبًا", "اهلا"]:
        return "مرحبًا! كيف يمكنني مساعدتك اليوم؟"
    elif user_input in custom_responses:
        return custom_responses[user_input]
    else:
        return chatbot.get_response(user_input)

# التفاعل مع المستخدم
print("مرحبًا! أنا شات بوت ذكي. يمكنك التحدث معي.")
while True:
    user_input = input("أنت: ")
    if user_input.lower() in ["exit", "خروج"]:
        print("شات بوت: إلى اللقاء!")
        break
    response = get_response(user_input)
    print(f"شات بوت: {response}")
import tkinter as tk
from tkinter import messagebox
import json
import random

# Cargar palabras desde el archivo JSON
with open('palabras_igles.json', 'r') as file:
    data = json.load(file)
    words = data['words']

class FlashcardApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Flashcard App")

        self.current_word = None
        self.score = 0

        self.word_label = tk.Label(root, text="", font=("Arial", 24))
        self.word_label.pack(pady=20)

        self.entry = tk.Entry(root, font=("Arial", 18))
        self.entry.pack(pady=20)

        self.check_button = tk.Button(root, text="Check", command=self.check_answer)
        self.check_button.pack(pady=20)

        self.next_button = tk.Button(root, text="Next", command=self.next_word)
        self.next_button.pack(pady=20)

        self.score_label = tk.Label(root, text="Score: 0", font=("Arial", 18))
        self.score_label.pack(pady=20)

        self.next_word()

    def next_word(self):
        self.current_word = random.choice(words)
        self.word_label.config(text=self.current_word['english'])
        self.entry.delete(0, tk.END)

    def check_answer(self):
        user_answer = self.entry.get().strip().lower()
        correct_answer = self.current_word['spanish'].lower()

        if user_answer == correct_answer:
            self.score += 1
            messagebox.showinfo("Correct!", "Good job!")
        else:
            messagebox.showerror("Incorrect", f"The correct answer was: {correct_answer}")

        self.score_label.config(text=f"Score: {self.score}")
        self.next_word()

if __name__ == "__main__":
    root = tk.Tk()
    app = FlashcardApp(root)
    root.mainloop()
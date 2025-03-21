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
        self.root.attributes('-fullscreen', True)

        self.current_word = None
        self.score = 0
        self.mode = 'english_to_spanish'  # Modo inicial

        self.word_label = tk.Label(root, text="", font=("Arial", 48))
        self.word_label.pack(pady=40)

        self.entry = tk.Entry(root, font=("Arial", 36))
        self.entry.pack(pady=40)
        self.entry.bind('<Return>', self.check_answer)

        self.check_button = tk.Button(root, text="Check", font=("Arial", 24), command=self.check_answer)
        self.check_button.pack(pady=40)

        self.next_button = tk.Button(root, text="Next", font=("Arial", 24), command=self.next_word)
        self.next_button.pack(pady=40)

        self.mode_button = tk.Button(root, text="Switch Mode", font=("Arial", 24), command=self.switch_mode)
        self.mode_button.pack(pady=40)

        self.score_label = tk.Label(root, text="Score: 0", font=("Arial", 36))
        self.score_label.pack(pady=40)

        self.next_word()

    def switch_mode(self):
        if self.mode == 'english_to_spanish':
            self.mode = 'spanish_to_english'
        else:
            self.mode = 'english_to_spanish'
        self.next_word()

    def next_word(self):
        self.current_word = random.choice(words)
        if self.mode == 'english_to_spanish':
            self.word_label.config(text=self.current_word['english'])
        else:
            self.word_label.config(text=self.current_word['spanish'])
        self.entry.delete(0, tk.END)

    def check_answer(self, event=None):
        user_answer = self.entry.get().strip().lower()
        if self.mode == 'english_to_spanish':
            correct_answer = self.current_word['spanish'].lower()
        else:
            correct_answer = self.current_word['english'].lower()

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
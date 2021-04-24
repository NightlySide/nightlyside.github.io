#!/usr/bin/env python
# -*- coding: utf-8 -*-

class VM:
    def __init__(self, num_reg = 4):
        self.regs = [0 for _ in range(num_reg)] # registers
        self.pc = 0 # program counter
        self.prog = None
        self.reg1 = self.reg2 = self.reg3 = self.imm = None
        self.running = False

    def fetch(self):
        instruction = self.prog[self.pc]
        self.pc += 1
        return instruction

    def decode(self, instr):
        instrNum      = (instr & 0xF000) >> 12
        self.reg2     = (instr & 0xF0  ) >>  4;
        self.reg1     = (instr & 0xF00 ) >>  8;
        self.reg3     = (instr & 0xF   )
        self.imm      = (instr & 0xFF  )
        return instrNum

    def eval(self, instrNum):
        if (instrNum == 0):
            print("halt")
            self.running = False
        elif (instrNum == 1):
            print(f"loadi r{self.reg1} #{self.imm}")
            self.regs[self.reg1] = self.imm
        elif (instrNum == 2):
            print(f"add r{self.reg1} r{self.reg2} r{self.reg3}")
            self.regs[self.reg1] = self.regs[self.reg2] + self.regs[self.reg3]
        elif (instrNum == 3):
            print(f"sub r{self.reg1} r{self.reg2} r{self.reg3}")
            self.regs[self.reg1] = self.regs[self.reg2] - self.regs[self.reg3]
        elif (instrNum == 4):
            print(f"mult r{self.reg1} r{self.reg2} r{self.reg3}")
            self.regs[self.reg1] = self.regs[self.reg2] * self.regs[self.reg3]
        elif (instrNum == 5):
            print(f"div r{self.reg1} r{self.reg2} r{self.reg3}")
            self.regs[self.reg1] = self.regs[self.reg2] / self.regs[self.reg3]
        elif (instrNum == 6):
            print(f"and r{self.reg1} r{self.reg2} r{self.reg3}")
            self.regs[self.reg1] = self.regs[self.reg2] & self.regs[self.reg3]
        elif (instrNum == 7):
            print(f"or r{self.reg1} r{self.reg2} r{self.reg3}")
            self.regs[self.reg1] = self.regs[self.reg2] | self.regs[self.reg3]
        elif (instrNum == 8):
            print(f"xor r{self.reg1} r{self.reg2} r{self.reg3}")
            self.regs[self.reg1] = self.regs[self.reg2] ^ self.regs[self.reg3]

    def showRegs(self):
        res = "regs ="
        for k in range(len(self.regs)):
            res += " " + str(hex(self.regs[k]))[2:].zfill(4)
        print(res)
    
    def run(self, prog, show_regs=True):
        self.prog = prog
        self.running = True
        while self.running:
            instruction = self.fetch()
            instrNum = self.decode(instruction)
            self.eval(instrNum)
            if show_regs: self.showRegs()
        self.prog = None

if __name__ == "__main__":
    # Structure d'une instruction :
    #     2          3            0          1       =  0x1301
    # num_instr  addr_reg_1  addr_reg_2  addr_reg_3
    #
    # Variante (pour charger un entier)
    #    1          0              6 4               = 0x1064
    # num_instr  addr_reg   valeur_immédiate (hex)

    prog = [0x1064, 0x11C8, 0x12FA, 0x2301, 0x3132, 0x2201, 0x0000]
    vm = VM(num_reg=4)
    vm.run(prog)

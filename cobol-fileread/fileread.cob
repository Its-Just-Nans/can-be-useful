       IDENTIFICATION DIVISION.
       PROGRAM-ID. SEQREAD.

       ENVIRONMENT DIVISION.
       INPUT-OUTPUT SECTION.
       FILE-CONTROL.
           SELECT EMPFILE ASSIGN TO "input.txt"
           ORGANIZATION IS SEQUENTIAL
           ACCESS MODE  IS SEQUENTIAL
           FILE STATUS  IS WS-FS1.

       DATA DIVISION.
       FILE SECTION.
       FD EMPFILE
           RECORD CONTAINS 41  CHARACTERS
           BLOCK  CONTAINS 41  CHARACTERS
           RECORDING MODE  IS  F
           DATA RECORD     IS EMPFILE-RECORD.
       01 EMPFILE-RECORD.
          05 EMP-ID        PIC X(05).
          05 EMP-NAME      PIC X(15).
          05 EMP-DESG      PIC X(10).
          05 EMP-SALARY    PIC 9(10).
          *>05 FILLER        PIC X(01).
          05 NEWLINE-CHAR PIC X VALUE X'0A'.

       WORKING-STORAGE SECTION.
       01 TOTAL PIC 9(10).
       01 WS-VAR.
          05 WS-FS1        PIC 9(02).
          05 WS-EOF-SW     PIC X(01).
             88 WS-EOF-IS-TRUE      VALUE 'Y'.
             88 WS-NOT-EOF           VALUE 'N'.

       PROCEDURE DIVISION.

           OPEN INPUT EMPFILE.
           SET  WS-NOT-EOF TO  TRUE.
           MOVE 0    TO TOTAL
           PERFORM UNTIL WS-EOF-IS-TRUE
                READ EMPFILE
                     AT END
                       SET WS-EOF-IS-TRUE TO TRUE
                     NOT AT END
                       ADD EMP-SALARY TO TOTAL
                       DISPLAY EMP-ID EMP-NAME EMP-DESG EMP-SALARY
                END-READ
           END-PERFORM.
           DISPLAY "Total " TOTAL.
           CLOSE EMPFILE.
           STOP RUN.

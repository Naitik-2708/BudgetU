#include <stdio.h>

// function to calculate average
float calculateAverage(int m1, int m2, int m3)
{
    float avg;
    avg = (m1 + m2 + m3) / 3.0;
    return avg;
}

int main()
{
    int n, i;
    
    printf("Enter number of students: ");
    scanf("%d", &n);

    // arrays for multiple students
    char name[50][50];
    int roll[50];
    int m1[50], m2[50], m3[50];
    float avg[50];
    char grade[50];

    for(i = 0; i < n; i++)
    {
        printf("\nEnter details of student %d\n", i + 1);

        printf("Enter name: ");
        scanf("%s", name[i]);

        printf("Enter roll number: ");
        scanf("%d", &roll[i]);

        printf("Enter marks in 3 subjects: ");
        scanf("%d %d %d", &m1[i], &m2[i], &m3[i]);

        // calculate average using function
        avg[i] = calculateAverage(m1[i], m2[i], m3[i]);

        // assign grade
        if(avg[i] >= 80)
        {
            grade[i] = 'A';
        }
        else if(avg[i] >= 60)
        {
            grade[i] = 'B';
        }
        else if(avg[i] >= 40)
        {
            grade[i] = 'C';
        }
        else
        {
            grade[i] = 'F';
        }
    }

    // display result
    printf("\n----- Student Report -----\n");

    for(i = 0; i < n; i++)
    {
        printf("\nName: %s", name[i]);
        printf("\nRoll No: %d", roll[i]);
        printf("\nAverage Marks: %.2f", avg[i]);
        printf("\nGrade: %c\n", grade[i]);
    }

    return 0;
}